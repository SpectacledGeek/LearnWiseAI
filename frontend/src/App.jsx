import React,{ useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import LearningChatbot from './screens/Chatbox';


function App() {  


  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/chatbot" element={<LearningChatbot/>} />
        

      </Routes>
    </Router>
    </>
  )
}

export default App
