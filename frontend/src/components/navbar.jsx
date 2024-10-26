

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import logo from "./logo.png";

export const SlideTabsExample = () => {
  return (
    <div className="py-3 relative shadow-md">
      {/* Larger Logo on the top-left */}
      <div className="absolute top-2 left-2 h-16 w-16">
        {/* Increased size */}
        <img src={logo} alt="Logo" className="h-full w-full object-cover" />
      </div>
      <SlideTabs />
    </div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [hovered, setHovered] = useState(false); // Hover state
  const navigate = useNavigate(); 

  const handleSignOut = () => {
    // Confirmation dialog
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      navigate('/'); // Navigate if confirmed
    }
  };

  return (
    <ul
      onMouseLeave={() => {
        setPosition((prev) => ({
          ...prev,
          opacity: 0,
        }));
        setHovered(false); // Reset hover state on mouse leave
      }}
      className="relative ml-[90%] mx-auto flex w-fit rounded-full font-semibold border border-3 border-[#F6C722] p-0.5"
    >
      <Tab 
        setPosition={setPosition} 
        hovered={hovered} 
        setHovered={setHovered} 
        onClick={handleSignOut} // Call handleSignOut on click
      >
        Sign Out
      </Tab>
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, setPosition, hovered, setHovered, onClick }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
        setHovered(true); // Set hover state to true on mouse enter
      }}
      onClick={onClick} // Ensure onClick is correctly applied
      className={`relative z-10 cursor-pointer px-2 py-1 text-[10px] uppercase transition-all duration-300 md:px-4 md:py-2 md:text-sm ${hovered ? "text-black" : "text-black"}`}
      onMouseLeave={() => setHovered(false)} // Reset hover on leave
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="absolute z-0 h-5 rounded-full bg-[#F6C722] md:h-10"
    />
  );
};
