import React, { useState, useEffect, useRef } from "react";
import EmojiPickerReact from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const EmojiPickerComponent = ({ setValue, tailwind, theme = "light" }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const pickerRef = useRef(null);


  const onEmojiClick = (emojiData) => {
    setValue((prev) => prev + emojiData.emoji);
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#161b1d]" : "bg-white";
  const headerColor = isDark ? "bg-[#1e2326]" : "bg-gray-100";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";
  const textColor = isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black";

  return (
    <div className="relative flex items-center justify-center" ref={pickerRef}>
    
      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="focus:outline-none flex items-center justify-center active:scale-90 transition-transform"
      >
        <BsEmojiSmile className={tailwind} />
      </button>

 
      {showEmoji && (
        <div 
          className={`fixed bottom-[85px] left-1/2 transform -translate-x-1/2 z-[9999] w-[92vw] max-w-[350px] ${bgColor} rounded-2xl border ${borderColor} shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()} 
        >
          
          <div className={`w-full flex justify-between items-center ${headerColor} px-4 py-2 border-b ${borderColor}`}>
            <span className={`${textColor} text-[12px] font-medium`}>Emojis</span>
            <span className={`${textColor} text-[14px] font-bold cursor-pointer transition-colors`}  onClick={() => setShowEmoji(false)}>
              ✕
            </span>
          </div>
          

          <div className="w-full h-[270px] overflow-hidden">
            <EmojiPickerReact onEmojiClick={onEmojiClick}  width="100%" height="100%" theme={theme} searchDisabled={false} skinTonesDisabled 
              previewConfig={{ showPreview: false }}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;