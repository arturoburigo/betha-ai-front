
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  chats, 
  activeChat, 
  onSelectChat, 
  onNewChat 
}) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Button 
          onClick={onNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
        >
          + Nova Conversa
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
                activeChat === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
