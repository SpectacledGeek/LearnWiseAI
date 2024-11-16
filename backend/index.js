// server.js
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config as configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import { User } from './src/models/user.model.js'; // Import models for User and Conversation
import  {Conversation}  from './src/models/conversation.model.js';  // Import models for User and Conversation
import userRoutes from './src/routes/user.router.js';

import mongoDB from './src/database/db.js';
import http from "http"
import { setupSocket } from './setupSocket.js';
import postRoutes from "./src/routes/post.routes.js"

// Load environment variables
configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;
const server=http.createServer(app);
const io=setupSocket(server);

// Initialize MongoDB connection
mongoDB();

// Middleware setup
app.set("io",io);
app.use("/api/posts",postRoutes)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// User Authentication Routes
app.use('/api/user', userRoutes);

// Community Posts Routes
app.use('/api/community-posts', postRoutes);

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Chat Processing Route
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation({
        userId: req.user.id,
        type: message.toLowerCase().includes('mcqs') ? 'mcqs' : 'notes'
      });
    }

    // Add user message to conversation
    conversation.messages.push({ role: 'user', content: message });

    // Spawn Python process for chat response
    const pythonProcess = spawn('python', ['bot.py']);
    let botResponse = '';

    pythonProcess.stdin.write(JSON.stringify({
      username: req.user.username,
      message: message,
      type: conversation.type
    }));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      botResponse += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          reject(new Error('Python process failed'));
          return;
        }

        conversation.messages.push({ role: 'assistant', content: botResponse });
        await conversation.save();
        resolve();
      });
    });

    res.json({ response: botResponse, conversationId: conversation._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// File Upload Route
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const conversation = new Conversation({
      userId: req.user.id,
      type: 'notes',
      files: [{ filename: req.file.originalname, path: req.file.path }]
    });

    await conversation.save();
    res.json({ message: 'File uploaded successfully', conversationId: conversation._id });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Chat History Route
app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort({ startTime: -1 });
    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
