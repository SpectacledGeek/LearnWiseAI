import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import LearningChatbot from "./screens/Chatbox";
import ChatInterface from "./screens/ChatInterface";
import ForumPage from './screens/ForumPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/chatbot" element={<LearningChatbot/>} />
        <Route path="/forum" element={<ForumPage/>} />
        <Route path="/ChatInterface" element={<ChatInterface/>} />
       
        

      </Routes>
    </Router>
    </>
  )
}

export default App;


