
// import { useState } from 'react';
// import { FaUser, FaEnvelope, FaLock, FaImage, FaSignInAlt } from 'react-icons/fa';
// import { MdEmail, MdLock, MdWarning } from 'react-icons/md';
// import { useNavigate } from 'react-router-dom';
// import { toast, Toaster } from 'sonner';

// const Login = () => {
//   const [activeTab, setActiveTab] = useState('login');
//   const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
//   const [signupCredentials, setSignupCredentials] = useState({
//     name: '',
//     email: '',
//     password: '',
//     avatar: null
//   });
//   const [loginError, setLoginError] = useState('');
//   const navigate = useNavigate();

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setLoginError('');
  
//     try {
//       const response = await fetch("http://localhost:5000/api/user/login", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(loginCredentials),
//         credentials: 'include'
//       });
  
//       let json;
//       try {
//         json = await response.json();
//       } catch (error) {
//         throw new Error("Unexpected response format");
//       }
  
//       if (!response.ok) {
//         toast.error(json.message || 'Wrong credentials, please try again.');
//       } else {
//         toast.success('Login successful!');
//         navigate('/chatbot');
//       }
//     } catch (err) {
//       setLoginError(err.message);
//       toast.error(err.message || 'An error occurred. Please try again.');
//     }
//   };
  

//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('name', signupCredentials.name);
//     formData.append('email', signupCredentials.email);
//     formData.append('password', signupCredentials.password);
//     if (signupCredentials.avatar) {
//       formData.append('avatar', signupCredentials.avatar);
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/user/register", {
//         method: 'POST',
//         body: formData,
//       });

//       const json = await response.json();

//       if (!json.success) {
//         toast.error('Registration failed. Please enter valid credentials.');
//       } else {
//         toast.success('Registration successful!');
//         setActiveTab('login');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   const handleLoginChange = (event) => {
//     setLoginCredentials({ ...loginCredentials, [event.target.name]: event.target.value });
//   };

//   const handleSignupChange = (event) => {
//     if (event.target.name === 'avatar') {
//       setSignupCredentials({ ...signupCredentials, avatar: event.target.files[0] });
//     } else {
//       setSignupCredentials({ ...signupCredentials, [event.target.name]: event.target.value });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <Toaster position="top-center" />
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Tabs */}
//         <div className="flex border-b">
//           <button
//             className={`flex-1 py-4 text-sm font-medium ${
//               activeTab === 'login'
//                 ? 'text-blue-900 border-b-2 border-blue-900'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//             onClick={() => setActiveTab('login')}
//           >
//             Log In
//           </button>
//           <button
//             className={`flex-1 py-4 text-sm font-medium ${
//               activeTab === 'signup'
//                 ? 'text-blue-900 border-b-2 border-blue-900'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//             onClick={() => setActiveTab('signup')}
//           >
//             Sign Up
//           </button>
//         </div>

//         <div className="px-6 py-8">
//           {activeTab === 'login' ? (
//             <>
//               <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
//               <p className="text-center text-gray-600 mb-8">Please sign in to your account</p>
//               <form onSubmit={handleLoginSubmit}>
//                 <div className="space-y-6">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                       Email
//                     </label>
//                     <div className="relative">
//                       <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         required
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Enter your email"
//                         value={loginCredentials.email}
//                         onChange={handleLoginChange}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                       <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         required
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Enter your password"
//                         value={loginCredentials.password}
//                         onChange={handleLoginChange}
//                       />
//                     </div>
//                   </div>
//                   <button
//                     type="submit"
//                     className="w-full bg-[#F6C722] text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
//                   >
//                     Sign In
//                   </button>
//                 </div>
//               </form>
//               {loginError && (
//                 <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                   <div className="flex items-center">
//                     <MdWarning className="mr-2" size={20} />
//                     <span>{loginError}</span>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create your account</h2>
//               <form onSubmit={handleSignupSubmit}>
//                 <div className="space-y-6">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                     <div className="relative">
//                       <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="John Doe"
//                         value={signupCredentials.name}
//                         onChange={handleSignupChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
//                     <div className="relative">
//                       <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input
//                         type="email"
//                         id="signup-email"
//                         name="email"
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="you@example.com"
//                         value={signupCredentials.email}
//                         onChange={handleSignupChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                     <div className="relative">
//                       <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input
//                         type="password"
//                         id="signup-password"
//                         name="password"
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="••••••••"
//                         value={signupCredentials.password}
//                         onChange={handleSignupChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
//                     <div className="flex items-center">
//                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//                         {signupCredentials.avatar ? (
//                           <img
//                             src={URL.createObjectURL(signupCredentials.avatar)}
//                             alt="Avatar preview"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <FaImage className="text-gray-400" size={24} />
//                         )}
//                       </div>
//                       <label
//                         htmlFor="avatar-upload"
//                         className="ml-4 px-3 py-2 text-sm font-medium text-blue-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
//                       >
//                         Change
//                       </label>
//                       <input
//                         id="avatar-upload"
//                         name="avatar"
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleSignupChange}
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full bg-[#F6C722] text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
//                   >
//                     Sign up
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaImage, FaRobot, FaBook, FaUserGraduate } from 'react-icons/fa';
import { MdEmail, MdLock, MdWarning } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [signupCredentials, setSignupCredentials] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null
  });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Existing handlers remain the same
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
  
    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials),
        credentials: 'include'
      });
  
      let json;
      try {
        json = await response.json();
      } catch (error) {
        throw new Error("Unexpected response format");
      }
  
      if (!response.ok) {
        toast.error(json.message || 'Wrong credentials, please try again.');
      } else {
        toast.success('Login successful!');
        navigate('/chatbot');
      }
    } catch (err) {
      setLoginError(err.message);
      toast.error(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', signupCredentials.name);
    formData.append('email', signupCredentials.email);
    formData.append('password', signupCredentials.password);
    if (signupCredentials.avatar) {
      formData.append('avatar', signupCredentials.avatar);
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!json.success) {
        toast.error('Registration failed. Please enter valid credentials.');
      } else {
        toast.success('Registration successful!');
        setActiveTab('login');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleLoginChange = (event) => {
    setLoginCredentials({ ...loginCredentials, [event.target.name]: event.target.value });
  };

  const handleSignupChange = (event) => {
    if (event.target.name === 'avatar') {
      setSignupCredentials({ ...signupCredentials, avatar: event.target.files[0] });
    } else {
      setSignupCredentials({ ...signupCredentials, [event.target.name]: event.target.value });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Toaster position="top-center" />
      
      {/* Left Section - Login/Signup Form */}
      <div className="w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-sm font-medium ${
                activeTab === 'login'
                  ? 'text-blue-900 border-b-2 border-blue-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium ${
                activeTab === 'signup'
                  ? 'text-blue-900 border-b-2 border-blue-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="px-6 py-8">
            {activeTab === 'login' ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-8">Please sign in to your account</p>
                <form onSubmit={handleLoginSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
                          value={loginCredentials.email}
                          onChange={handleLoginChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your password"
                          value={loginCredentials.password}
                          onChange={handleLoginChange}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#F6C722] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
                {loginError && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <div className="flex items-center">
                      <MdWarning className="mr-2" size={20} />
                      <span>{loginError}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Signup form content remains the same
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create your account</h2>
                <form onSubmit={handleSignupSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John Doe"
                          value={signupCredentials.name}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          id="signup-email"
                          name="email"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="you@example.com"
                          value={signupCredentials.email}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="password"
                          id="signup-password"
                          name="password"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="••••••••"
                          value={signupCredentials.password}
                          onChange={handleSignupChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {signupCredentials.avatar ? (
                            <img
                              src={URL.createObjectURL(signupCredentials.avatar)}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaImage className="text-gray-400" size={24} />
                          )}
                        </div>
                        <label
                          htmlFor="avatar-upload"
                          className="ml-4 px-3 py-2 text-sm font-medium text-blue-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          Change
                        </label>
                        <input
                          id="avatar-upload"
                          name="avatar"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleSignupChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#F6C722] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - LearnWise Info */}
      <div className="w-1/2 bg-blue-900 text-white p-12 flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome to LearnWise</h1>
          <p className="text-xl mb-12">Your personal AI-powered learning companion</p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FaRobot className="w-8 h-8 text-[#F6C722]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Personalized AI Tutoring</h3>
                <p className="text-gray-300">Experience one-on-one learning with our advanced AI tutor that adapts to your unique learning style and pace.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FaUserGraduate className="w-8 h-8 text-[#F6C722]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Smart Learning Path</h3>
                <p className="text-gray-300">Get customized learning paths that evolve with your progress and help you achieve your educational goals.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FaBook className="w-8 h-8 text-[#F6C722]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Resources</h3>
                <p className="text-gray-300">Access a vast library of educational materials, practice exercises, and interactive content tailored to your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;