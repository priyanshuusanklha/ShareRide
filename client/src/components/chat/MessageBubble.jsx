import React from 'react';
import { format } from 'date-fns';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${isOwn ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'}`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
          {message.createdAt ? format(new Date(message.createdAt), 'h:mm a') : ''}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
