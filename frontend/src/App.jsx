import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import LearningChatbot from './screens/Chatbox';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/chatbot" element={<LearningChatbot/>} />
        
        

      </Routes>
    </Router>
    </>
  )
}

export default App
