import { useState } from "react";
import PropTypes from 'prop-types';

// TODO: Replace this with real user fetching logic
const users = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

const MessageDrawer = ({ open, onClose }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      {/* Drawer */}
      <div
        className="ml-auto w-full max-w-md bg-white h-full shadow-xl flex flex-col transition-transform duration-300 ease-in-out transform"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Send Message</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">&times;</button>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-3">
          {/* User select */}
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="" disabled>Select user</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          {/* Message input */}
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition flex-1 resize-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedUser || !message.trim()}
            onClick={() => {
              // TODO: send message logic;
              console.log(`Sending to ${selectedUser}: ${message}`);
              setMessage("");
              onClose();
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

MessageDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MessageDrawer;
