import { useState, useEffect } from 'react';
import { BsMicFill, BsUpload, BsVolumeUpFill, BsSendFill, BsX } from 'react-icons/bs';
import { SlideTabsExample } from '../components/navbar';

const formatText = (text) => {
  return text
    .replace(/\n/g, '<br>') // Replace newlines with <br> tags for line breaks
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert **text** to bold
    .replace(/_(.*?)_/g, '<i>$1</i>'); // Convert _text_ to italic
};

export default function Component() {
  // State variables from both components
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState(new Map());
  const [recognition, setRecognition] = useState(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/current", {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const json = await response.json();
        if (json.success) {
          setUserName(json.data.name);
          setUserAvatar(json.data.avatar);
        } else {
          setError(json.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Speech recognition setup
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

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setRecognition(recognition);
    }
  }, []);

  // Chat functionality
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
        throw new Error(`Server Error: ${errorResponse.error}`);
      }

      const data = await result.json();
      setResponse(data.response);
      setMessages([...messages,
        { text: message, type: 'user', files: Array.from(attachments.values()) },
        { text: data.response, type: 'bot' }
      ]);
      setMessage('');
      setAttachments(new Map());
    } catch (error) {
      console.error("Error sending message:", error.message);
      setResponse("Error: Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // File upload functionality
  const uploadFile = async (file) => {
    if (!file) return;

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
        throw new Error(`Server Error: ${errorResponse.error}`);
      }

      const data = await result.json();
      setResponse(data.response);
      setMessages([...messages, {
        text: `File uploaded: ${file.name}`,
        type: 'user',
        files: [{ file, type: file.type }]
      }, {
        text: data.response,
        type: 'bot'
      }]);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      setResponse("Error: Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) return alert('Speech recognition is not supported in your browser.');
    isListening ? recognition.stop() : recognition.start();
    setIsListening(!isListening);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage();
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
      if (file.type === 'application/pdf') {
        uploadFile(file);
      } else {
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
        newAttachments.set(file.name, { file, previewUrl, type: file.type });
      }
    });

    setAttachments(newAttachments);
    event.target.value = '';
  };

  const removeFile = (fileName) => {
    const newAttachments = new Map(attachments);
    if (newAttachments.get(fileName)?.previewUrl) {
      URL.revokeObjectURL(newAttachments.get(fileName).previewUrl);
    }
    newAttachments.delete(fileName);
    setAttachments(newAttachments);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <SlideTabsExample />
      <div className="flex">
        <div className="flex flex-col w-full h-screen">
          <div className="p-2">
            <h1 className="text-4xl ml-[37%] mt-7 font-serif text-gray-800 flex items-center gap-3">
              <span className="text-[#F6C722] text-3xl">✻</span> Welcome {userName}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 pb-32">
              <div className="bg-gray-100 rounded-lg shadow-sm p-6 mb-4 ml-[29%] w-[40%]">
                <div className="flex items-center space-x-4">
                  {userAvatar && <img src={userAvatar} alt="User Avatar" className="w-16 h-16 rounded-full object-cover" />}
                  <h2 className="text-xl text-gray-600">How can LearnWise help you today, {userName}?</h2>
                </div>
              </div>

              <div className="ml-[26%] w-[45%] mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Get Summary', 'Quick Notes', 'Prepare with Practice Questions'].map((prompt, idx) => (
                  <button 
                    key={idx} 
                    className="p-4 bg-blue-900 text-white rounded-lg border transition-colors hover:bg-white hover:text-black hover:border-[#F6C722] hover:shadow-lg"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-6 ml-[20%] w-[60%] space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div
                      className={`flex-1 bg-gray-100 rounded-lg p-4 shadow-sm ${msg.type === 'bot' ? 'bg-blue-50' : ''}`}
                      // Render formatted bot response as HTML
                      dangerouslySetInnerHTML={{
                        __html: msg.type === 'bot' ? formatText(msg.text) : msg.text,
                      }}
                    />
                    <button 
                      onClick={() => handleSpeak(msg.text)} 
                      disabled={isSpeaking} 
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                    >
                      <BsVolumeUpFill className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-lg flex items-center gap-2">
              <input
                type="file"
                accept=".pdf, image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <BsUpload className="w-8 h-8 text-blue-900 hover:text-blue-700" />
              </label>

              <div className="flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Type your message..."
                />
              </div>
              <button onClick={handleSend} className="bg-blue-900 text-white rounded-lg p-2 hover:bg-blue-700 flex items-center">
                <BsSendFill className="w-5 h-5" />
              </button>
              <button onClick={toggleVoiceInput} className={`flex items-center justify-center p-2 rounded-lg ${isListening ? 'bg-red-500' : 'bg-gray-300'}`}>
                <BsMicFill className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-16 left-0 right-0 p-4">
        
        <div className="flex flex-wrap gap-2">
          {Array.from(attachments.keys()).map(fileName => (
            <div key={fileName} className="flex items-center bg-gray-200 rounded p-2">
              <span>{fileName}</span>
              <button onClick={() => removeFile(fileName)} className="ml-2 text-red-500 hover:text-red-700">
                <BsX />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
