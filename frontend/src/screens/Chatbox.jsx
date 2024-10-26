
import { useState, useEffect } from 'react';
import { BsMicFill, BsUpload, BsVolumeUpFill, BsSendFill, BsX } from 'react-icons/bs';
import { SlideTabsExample } from '../components/navbar';

export default function Component() {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState(new Map());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recognition, setRecognition] = useState(null);

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

  const toggleVoiceInput = () => {
    if (!recognition) return alert('Speech recognition is not supported in your browser.');
    isListening ? recognition.stop() : recognition.start();
    setIsListening(!isListening);
  };

  const handleSend = () => {
    if (message.trim() || attachments.size > 0) {
      setMessages([...messages, { text: message, type: 'user', files: Array.from(attachments.values()) }]);
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
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      newAttachments.set(file.name, { file, previewUrl, type: file.type });
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
        <div className="flex flex-col w-full h-screen"  
               >
          <div className="p-2 ">
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

              <div className=" ml-[26%] w-[45%] mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Get Summary', 'Quick Notes', 'Prepare with Practice Questions'].map((prompt, idx) => (
                  <button key={idx} className="p-4 bg-blue-900 text-white rounded-lg border transition-colors hover:bg-white hover:text-black hover:border-[#F6C722] hover:shadow-lg">
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-6 ml-[20%] w-[60%]  space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center p-3 text-xl gap-2">
                        {msg.text}
                        <button onClick={() => handleSpeak(msg.text)} disabled={isSpeaking} className="text-blue-500 hover:text-blue-700 disabled:opacity-50">
                          <BsVolumeUpFill className="w-4 text-[#F6C722] h-4" />
                        </button>
                      </div>
                      {msg.files && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.files.map((file, fileIdx) => (
                            <div key={fileIdx} className="text-sm text-gray-600">
                              {file.type.startsWith('image/') && file.previewUrl && <img src={file.previewUrl} alt={file.file.name} className="max-w-[200px] max-h-[200px] rounded" />}
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

          <div className={`fixed bottom-0 left-0 w-full ${isCollapsed ? 'pl-20' : 'pl-64'} bg-white border-t`}>
            {attachments.size > 0 && (
              <div className="px-3 py-2 border-b">
                <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
                  {Array.from(attachments.entries()).map(([fileName, file]) => (
                    <div key={fileName} className="relative group">
                      {file.previewUrl ? (
                        <div className="relative">
                          <img src={file.previewUrl} alt={fileName} className="h-20 w-20 object-cover rounded" />
                          <button onClick={() => removeFile(fileName)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <BsX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative bg-gray-100 p-2 rounded">
                          <span className="text-sm text-gray-600">{fileName}</span>
                          <button onClick={() => removeFile(fileName)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <BsX className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="p-3 mr-[20%]">
              <div className="max-w-4xl mx-auto flex gap-3">
                <button onClick={toggleVoiceInput} className={`p-3 rounded-full ${isListening ? 'bg-blue-900' : 'bg-blue-700'} text-white hover:bg-blue-900 transition-colors`}>
                  <BsMicFill className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-10 border border-[#F6C722] rounded-lg shadow-sm "
                  />
                  <label className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
                    <input type="file" className="hidden" multiple onChange={handleFileUpload} />
                    <BsUpload className="w-5 h-5 text-gray-400 hover:text-gray-500" />
                  </label>
                </div>

                <button onClick={handleSend} className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-900 transition-colors">
                  <BsSendFill className="w-5 h-5" />
                </button>
              </div>
            </div>



          </div>
        </div>
      </div>
    </>
  );
}


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BsMicFill, BsUpload, BsVolumeUpFill, BsSendFill, BsX } from 'react-icons/bs';
// import { SlideTabsExample } from '../components/navbar';

// function Component() {
//   const [userName, setUserName] = useState('');
//   const [userAvatar, setUserAvatar] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [attachments, setAttachments] = useState(new Map());
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState('');

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/user/current", {
//           method: 'GET',
//           credentials: 'include'
//         });
        
//         if (!response.ok) throw new Error('Failed to fetch user data');
        
//         const json = await response.json();
//         if (json.success) {
//           setUserName(json.data.name);
//           setUserAvatar(json.data.avatar);
//         } else {
//           setError(json.message || 'Failed to fetch user data');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();

//     if ('webkitSpeechRecognition' in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setMessage(prev => prev + transcript);
//         setIsListening(false);
//       };

//       recognition.onerror = () => setIsListening(false);
//       recognition.onend = () => setIsListening(false);

//       setRecognition(recognition);
//     }
//   }, []);

//   const sendMessage = async () => {
//     try {
//       const result = await axios.post('http://localhost:5000/api/chat', { message });
//       setResponse(result.data.response);
//       setMessages([...messages, { text: message, type: 'user' }]);
//       setMessage('');
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setResponse("Error: Failed to send message.");
//     }
//   };

//   const uploadFile = async () => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const result = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setResponse(result.data.response);
//       setMessages([...messages, { text: "File uploaded successfully!", type: 'user' }]);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setResponse("Error: Failed to upload file.");
//     }
//   };

//   const toggleVoiceInput = () => {
//     if (!recognition) return alert('Speech recognition is not supported in your browser.');
//     isListening ? recognition.stop() : recognition.start();
//     setIsListening(!isListening);
//   };

//   const handleSpeak = (text) => {
//     if ('speechSynthesis' in window) {
//       setIsSpeaking(true);
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.onend = () => setIsSpeaking(false);
//       speechSynthesis.speak(utterance);
//     }
//   };

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     const newAttachments = new Map(attachments);
//     Array.from(files).forEach(file => {
//       const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
//       newAttachments.set(file.name, { file, previewUrl, type: file.type });
//     });
//     setAttachments(newAttachments);
//     setFile(files[0]);
//     event.target.value = '';
//   };

//   const removeFile = (fileName) => {
//     const newAttachments = new Map(attachments);
//     if (newAttachments.get(fileName)?.previewUrl) {
//       URL.revokeObjectURL(newAttachments.get(fileName).previewUrl);
//     }
//     newAttachments.delete(fileName);
//     setAttachments(newAttachments);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <>
//       <SlideTabsExample />
//       <div className="flex">
//         <div className="flex flex-col w-full h-screen">
//           <div className="p-2 ">
//             <h1 className="text-4xl ml-[37%] mt-7 font-serif text-gray-800 flex items-center gap-3">
//               <span className="text-[#F6C722] text-3xl">✻</span> Welcome {userName}
//             </h1>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             <div className="p-4 pb-32">
//               <div className="bg-gray-100 rounded-lg shadow-sm p-6 mb-4 ml-[29%] w-[40%]">
//                 <div className="flex items-center space-x-4">
//                   {userAvatar && <img src={userAvatar} alt="User Avatar" className="w-16 h-16 rounded-full object-cover" />}
//                   <h2 className="text-xl text-gray-600">How can LearnWise help you today, {userName}?</h2>
//                 </div>
//               </div>

//               <div className="ml-[26%] w-[45%] mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {['Get Summary', 'Quick Notes', 'Prepare with Practice Questions'].map((prompt, idx) => (
//                   <button key={idx} className="p-4 bg-blue-900 text-white rounded-lg border transition-colors hover:bg-white hover:text-black hover:border-[#F6C722] hover:shadow-lg">
//                     {prompt}
//                   </button>
//                 ))}
//               </div>

//               <div className="mt-6 ml-[20%] w-[60%] space-y-4">
//                 {messages.map((msg, idx) => (
//                   <div key={idx} className="flex gap-2 items-start">
//                     <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-sm">
//                       <div className="flex items-center p-3 text-xl gap-2">
//                         {msg.text}
//                         <button onClick={() => handleSpeak(msg.text)} disabled={isSpeaking} className="text-blue-500 hover:text-blue-700 disabled:opacity-50">
//                           <BsVolumeUpFill className="w-4 text-[#F6C722] h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="fixed bottom-0 left-0 w-full bg-white border-t">
//             {attachments.size > 0 && (
//               <div className="px-3 py-2 border-b">
//                 <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
//                   {Array.from(attachments.entries()).map(([fileName, file]) => (
//                     <div key={fileName} className="relative group">
//                       {file.previewUrl ? (
//                         <div className="relative">
//                           <img src={file.previewUrl} alt={fileName} className="h-20 w-20 object-cover rounded" />
//                           <button onClick={() => removeFile(fileName)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <BsX className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="relative bg-gray-100 p-2 rounded">
//                           <span className="text-sm text-gray-600">{fileName}</span>
//                           <button onClick={() => removeFile(fileName)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <BsX className="w-4 h-4" />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="p-3 mr-[26%]">
//               <div className="max-w-4xl mx-auto flex gap-3">
//                 <button onClick={toggleVoiceInput} className={`p-3 rounded-full ${isListening ? 'bg-blue-900' : 'bg-blue-700'} text-white hover:bg-blue-900 transition-colors`}>
//                   <BsMicFill className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
//                 </button>

//                 <div className="flex-1 relative">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type your message..."
//                     className="w-full px-4 py-3 pr-10 border border-[#F6C722] rounded-lg shadow-sm"
//                   />
//                   <label className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
//                     <input type="file" className="hidden" multiple onChange={handleFileUpload} />
//                     <BsUpload className="w-5 h-5 text-gray-400 hover:text-gray-500" />
//                   </label>
//                 </div>

//                 <button onClick={() => { sendMessage(); uploadFile(); }} className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-900 transition-colors">
//                   <BsSendFill className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Component;
