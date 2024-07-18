import { useState } from "react";
import { FaMessage } from "react-icons/fa6";

export const DialogflowChatbot = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute bottom-10 right-10">
      <div className="relative">
        <iframe
          className={`${
            open ? "block" : "hidden"
          } bottom-10 relative shadow-lg rounded-md`}
          width="350"
          height="430"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/2613b17b-66a8-4f7b-92a7-59f5e9ffd12a"
        />
        <FaMessage
          className="cursor-pointer text-2xl absolute right-5 bottom-0"
          onClick={() => setOpen(!open)}
        />
      </div>
    </div>
  );
};
