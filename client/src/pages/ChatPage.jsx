import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getMyChats, getChatMessages, sendMessage as apiSendMessage } from '../api/chat';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const ChatPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getMyChats();
        setChats(data);
        
        // Handle pre-selected chat from navigation
        if (location.state?.activeChatId && data.length > 0) {
          const chat = data.find(c => c._id === location.state.activeChatId);
          if (chat) handleSelectChat(chat);
        }
      } catch (err) {
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    try {
      const msgs = await getChatMessages(chat._id);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeChat) return;
    try {
      const newMsg = await apiSendMessage(activeChat._id, { content });
      setMessages(prev => [...prev, newMsg]);
      
      // Update last message in chat list
      setChats(prev => prev.map(c => 
        c._id === activeChat._id 
          ? { ...c, lastMessage: newMsg, updatedAt: new Date() } 
          : c
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-8"><ErrorMessage message={error} /></div>;

  return (
    <div className="max-w-6xl mx-auto py-6 h-[calc(100vh-140px)]">
      <div className="bg-white rounded-lg shadow h-full flex overflow-hidden border border-gray-200">
        
        <div className={`w-full md:w-1/3 border-r border-gray-200 h-full flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 bg-gray-50 font-medium text-lg">
            Messages
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatList 
              chats={chats} 
              activeChatId={activeChat?._id} 
              onSelectChat={handleSelectChat} 
            />
          </div>
        </div>

        <div className={`w-full md:w-2/3 h-full flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="md:hidden p-2 bg-gray-50 border-b flex items-center">
                <button onClick={() => setActiveChat(null)} className="text-indigo-600 mr-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
              <ChatWindow 
                chat={activeChat} 
                messages={messages} 
                currentUserId={user?._id} 
                onSendMessage={handleSendMessage} 
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
              Select a conversation to start chatting
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ChatPage;
