import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const EmojiPickerComponent = ({ setValue,tailwind }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  const onEmojiClick = (emojiData) => {
    setValue((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
      >
        <BsEmojiSmile className={tailwind} />
      </button>

      {showEmoji && (
        <div className="absolute bottom-[60px] right-0 z-[999]">
          <div className="flex justify-end mb-1">
            <button type="button"onClick={() => setShowEmoji(false)}className="text-red-500 font-bold text-lg">
              X
            </button>
          </div>

          <EmojiPicker onEmojiClick={onEmojiClick} autoFocusSearch={false}/>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;