# LearnWiseAI

LearnWiseAI is an intelligent learning platform that combines RAG-based chatbot technology with accessibility features to create an inclusive and interactive educational experience. The platform leverages OLlama and LangChain to provide personalized learning assistance and supports collaborative learning through real-time discussions.

## ✨ Key Features

### AI-Powered Learning Assistant
- **Smart Content Generation**: Automatically generates MCQs, summaries, study notes, and learning roadmaps
- **Custom Report Creation**: Generates detailed reports based on user requirements and learning progress
- **RAG-Based Architecture**: Utilizes Retrieval-Augmented Generation for accurate and contextual responses

### Accessibility Features
- **Text-to-Speech Integration**: Converts text content to speech for visually impaired users
- **Speech-to-Text Capability**: Enables voice input for hands-free interaction
- **Multi-Language Support**: Automatic translation of chatbot responses to various languages
- **Responsive Design**: Ensures seamless usage across different devices and screen sizes

### Collaborative Learning
- **Real-Time Discussion Forum**: WebSocket-powered live discussion platform
- **Interactive Study Groups**: Create and join study groups for collaborative learning
- **Resource Sharing**: Easy sharing of study materials and notes

## 🛠️ Technology Stack

- **Frontend**:
  - React
  - Tailwind CSS
  - WebSocket client

- **Backend**:
  - Flask (Python)
  - Node.js
  - WebSocket server
  
- **Database**:
  - MongoDB

- **AI/ML**:
  - OLlama
  - LangChain
  
- **Version Control**:
  - Git

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/LearnWiseAI.git

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
npm install

# Install OLlama and LangChain
pip install ollama langchain
```

## ⚙️ Configuration

1. Create a `.env` file in the root directory:
```
MONGODB_URI=your_mongodb_uri
OLLAMA_API_KEY=your_ollama_key
PORT=3000
```

2. Configure MongoDB connection in `backend/config/db.js`

## 🚀 Running the Application

```bash
# Start the Flask backend
cd backend/flask
python app.py

# Start the Node.js server
cd backend/node
npm start

# Start the frontend
cd frontend
npm start
```

## 🔧 Development Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Ensure OLlama is properly configured
3. Set up your preferred code editor with ESLint and Prettier
4. Configure Git hooks for consistent code formatting

## 🎯 Future Roadmap

- Implementation of personalized learning paths
- Advanced analytics dashboard for tracking learning progress
- Integration with popular learning management systems
- Mobile application development
- Enhanced AI models for better content generation
- Support for more languages and accessibility features

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
python -m pytest
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.
