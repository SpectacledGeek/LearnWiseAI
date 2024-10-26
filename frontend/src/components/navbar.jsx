

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "./logo.png";

export const SlideTabsExample = () => {
  const location = useLocation();
  
  return (
    <div className="py-3 relative shadow-md flex items-center">
      {/* Logo on the left */}
      <div className="h-16 w-16 ml-2">
        <img src={logo} alt="Logo" className="h-full w-full object-cover" />
      </div>
      
      {/* Navigation buttons */}
      <div className="ml-[7%] flex gap-4">
        <NavButton to="/chatbot" isActive={location.pathname === '/chatbot'}>
          Chatbot
        </NavButton>
        <NavButton to="/forum" isActive={location.pathname === '/forum'}>
          Community
        </NavButton>
      </div>
      
      {/* Sign out button pushed to the right */}
      <div className="ml-auto mr-4">
        <SignOutButton />
      </div>
    </div>
  );
};

const NavButton = ({ children, to, isActive }) => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({
    opacity: 0,
    width: 0,
  });
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      width,
      opacity: 1,
    });
    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isActive) {
      setPosition(prev => ({
        ...prev,
        opacity: 0,
      }));
    }
    setHovered(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <button
        onClick={() => navigate(to)}
        className={`relative z-10 px-4 py-2 text-sm font-semibold uppercase border rounded-full transition-all duration-300 ${
          isActive 
            ? 'border-[#F6C722] text-black bg-[#F6C722]' 
            : 'border-[#F6C722] hover:text-black'
        }`}
      >
        {children}
      </button>
      {!isActive && (
        <motion.div
          animate={{
            width: position.width,
            opacity: position.opacity,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="absolute inset-0 rounded-full bg-[#F6C722] -z-10"
        />
      )}
    </div>
  );
};

const SignOutButton = () => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({
    opacity: 0,
    width: 0,
  });
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleSignOut = () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      navigate('/');
    }
  };

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      width,
      opacity: 1,
    });
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setPosition(prev => ({
      ...prev,
      opacity: 0,
    }));
    setHovered(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <button
        onClick={handleSignOut}
        className="relative z-10 px-4 py-2 text-sm font-semibold uppercase border border-[#F6C722] rounded-full hover:text-black transition-all duration-300"
      >
        Sign Out
      </button>
      <motion.div
        animate={{
          width: position.width,
          opacity: position.opacity,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute inset-0 rounded-full bg-[#F6C722] -z-10"
      />
    </div>
  );
};

export default SlideTabsExample;