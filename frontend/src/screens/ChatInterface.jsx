import React, { useState } from 'react';
import axios from 'axios';

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [file, setFile] = useState(null);

  // Function to handle sending text messages
  const sendMessage = async () => {
    try {
      const result = await axios.post('http://localhost:5000/api/chat', { message });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse("Error: Failed to send message.");
    }
  };

  // Function to handle file upload
  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponse("Error: Failed to upload file.");
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div>
      <h2>Chat with Bot</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your command..."
        />
        <button type="submit">Send</button>
      </form>

      <h3>Upload PDF for Analysis</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      {response && (
        <div>
          <h3>Bot Response</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
