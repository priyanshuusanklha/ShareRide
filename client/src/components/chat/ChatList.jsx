import React from 'react';
import { format } from 'date-fns';
import useAuth from '../../hooks/useAuth';

const ChatList = ({ chats, activeChatId, onSelectChat }) => {
  const { user } = useAuth();

  if (!chats || chats.length === 0) {
    return <div className="p-4 text-center text-gray-500">No conversations yet.</div>;
  }

  const getOtherParticipant = (chat) => {
    if (!chat.participants || !user) return { name: 'User' };
    return chat.participants.find(p => p._id !== user._id) || chat.participants[0] || { name: 'User' };
  };

  const getRideLabel = (chat) => {
    if (!chat.ride) return '';
    const origin = chat.ride.origin?.address || chat.ride.origin || '';
    const dest = chat.ride.destination?.address || chat.ride.destination || '';
    return origin && dest ? `${origin} → ${dest}` : '';
  };

  return (
    <div className="divide-y divide-gray-200">
      {chats.map(chat => {
        const other = getOtherParticipant(chat);
        const rideLabel = getRideLabel(chat);
        return (
          <div 
            key={chat._id} 
            onClick={() => onSelectChat(chat)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeChatId === chat._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-medium text-gray-900 truncate pr-2">{other.name}</h4>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {chat.updatedAt ? format(new Date(chat.updatedAt), 'MMM d') : ''}
              </span>
            </div>
            {rideLabel && <p className="text-xs text-indigo-500 truncate mb-1">{rideLabel}</p>}
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage?.content || 'No messages yet'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
