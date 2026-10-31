import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ chat, messages, currentUserId, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  if (!chat) {
    return <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">Select a conversation to start chatting</div>;
  }

  // Derive the other participant's name
  let otherName = 'Chat';
  if (chat.participants) {
    const other = chat.participants.find(p => p._id !== currentUserId) || chat.participants[0];
    if (other && other.name) otherName = other.name;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="text-lg font-medium">{otherName}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages && messages.map((msg, idx) => (
          <MessageBubble 
            key={msg._id || idx} 
            message={msg} 
            isOwn={msg.sender === currentUserId || msg.sender?._id === currentUserId} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            className="input-field flex-1"
            placeholder="Type a message..."
          />
          <button type="submit" className="btn-primary" disabled={!newMessage.trim()}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
