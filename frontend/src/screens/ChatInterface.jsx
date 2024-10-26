import React, { useState } from 'react';

function ChatInterface() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle sending text messages
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!result.ok) {
        const errorResponse = await result.json();
        throw new Error(`Server Error: ${errorResponse.error}`); // Fixed string interpolation
      }

      const data = await result.json();
      setResponse(data.response);
      setMessage(''); // Clear input after successful send
    } catch (error) {
      console.error("Error sending message:", error.message);
      setResponse("Error: Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle file upload
  const uploadFile = async () => {
    if (!file) {
      setResponse("Please select a file first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!result.ok) {
        const errorResponse = await result.json();
        throw new Error(`Server Error: ${errorResponse.error}`); // Fixed string interpolation
      }

      const data = await result.json();
      setResponse(data.response);
      setFile(null); // Clear file input after successful upload
    } catch (error) {
      console.error("Error uploading file:", error.message);
      setResponse("Error: Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Function to handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setResponse(''); // Clear previous response
      } else {
        setResponse('Please upload a PDF file');
        e.target.value = ''; // Clear file input
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Chat with Bot</h2>
      
      {/* Message Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your command..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={isLoading || !message.trim()}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isLoading || !message.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      {/* File Upload Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload PDF for Analysis</h3>
        <div className="flex gap-2">
          <input 
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="flex-1 p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            onClick={uploadFile}
            disabled={isLoading || !file}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isLoading || !file 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Response Section */}
      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Bot Response</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
