
import { useState, useEffect } from 'react';
import { BsMicFill, BsSendFill, BsVolumeUpFill, BsUpload, BsX } from 'react-icons/bs';
import { SlideTabsExample } from '../components/navbar';
import Sidebar from '../components/sidebar';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const LearningChatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState(new Map());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (message.trim() || attachments.size > 0) {
      setMessages([...messages, { 
        text: message, 
        type: 'user',
        files: Array.from(attachments.values())
      }]);
      setMessage('');
      setAttachments(new Map());
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newAttachments = new Map(attachments);
    
    Array.from(files).forEach(file => {
      const previewUrl = file.type.startsWith('image/') 
        ? URL.createObjectURL(file)
        : null;
      
      newAttachments.set(file.name, {
        file,
        previewUrl,
        type: file.type
      });
    });
    
    setAttachments(newAttachments);
    event.target.value = '';
  };

  const removeFile = (fileName) => {
    const newAttachments = new Map(attachments);
    const attachment = newAttachments.get(fileName);
    
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    
    newAttachments.delete(fileName);
    setAttachments(newAttachments);
  };

  return (
    <>
      <SlideTabsExample />
      <div className="flex">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-col w-full h-screen bg-gray-100 ">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-4xl ml-[30%] font-serif text-gray-800 flex items-center gap-3">
              <span className="text-blue-900 text-3xl">✻</span>
              Good evening Sara
            </h1>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Chat Area with Padding */}
            <div className="p-6 pb-32">
              <Card className="p-6 mb-4 ml-[30%] w-[40%]">
                <h2 className="text-xl  text-gray-600 mb-4">
                  How can LearWise help you today?
                </h2>
              </Card>

              {/* Example Prompts */}
              <div className="mt-6">
                <div className="text-gray-600 mb-4">Get started with an example below</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Polish your prose', 'Write a memo', 'Generate interview questions'].map((prompt, idx) => (
                    <button
                      key={idx}
                      className="p-4 bg-blue-900 text-white rounded-lg text-left hover:bg-[#f3efe9] transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="mt-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        {msg.text}
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="text-blue-500 hover:text-blue-600"
                          disabled={isSpeaking}
                        >
                          <BsVolumeUpFill className="w-4 h-4" />
                        </button>
                      </div>
                      {msg.files && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.files.map((file, fileIdx) => (
                            <div key={fileIdx} className="text-sm text-gray-600">
                              {file.type.startsWith('image/') && file.previewUrl && (
                                <img 
                                  src={file.previewUrl} 
                                  alt={file.file.name}
                                  className="max-w-[200px] max-h-[200px] rounded"
                                />
                              )}
                              <span>{file.file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Input Area with File Preview - Fixed at Bottom */}
          <div className={`fixed bottom-0 left-0 w-full ${isCollapsed ? 'pl-20' : 'pl-64'} bg-white border-t`}>
            {/* File Preview Area */}
            {attachments.size > 0 && (
              <div className="px-3 py-2 border-b">
                <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
                  {Array.from(attachments.entries()).map(([fileName, file]) => (
                    <div key={fileName} className="relative group">
                      {file.previewUrl ? (
                        <div className="relative">
                          <img 
                            src={file.previewUrl} 
                            alt={fileName}
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            onClick={() => removeFile(fileName)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <BsX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative bg-gray-100 p-2 rounded">
                          <span className="text-sm text-gray-600">{fileName}</span>
                          <button
                            onClick={() => removeFile(fileName)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <BsX className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Box */}
            <div className="p-3">
              <div className="max-w-4xl mx-auto flex gap-3">
                <button 
                  className={`p-3 rounded-full ${
                    isListening 
                      ? 'bg-cyan-700 hover:bg-cyan-700' 
                      : 'bg-cyan-500 hover:bg-cyan-500'
                  } text-white transition-colors duration-200`}
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Stop recording' : 'Voice input'}
                >
                  <BsMicFill className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? 'Listening...' : 'Messege here...'}
                    className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 pl-4 pr-24"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <label className="cursor-pointer text-cyan-500 hover:text-cyan-500 transition-colors duration-200">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <BsUpload className="w-5 h-5 mr-5" />
                    </label>
                    <button 
                      onClick={handleSend}
                      className="text-cyan-500 hover:text-cyan-500 transition-colors duration-200"
                    >
                      <BsSendFill className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningChatbot;