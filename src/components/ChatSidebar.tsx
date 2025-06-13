import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
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
  onDeleteChat: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  chats, 
  activeChat, 
  onSelectChat, 
  onNewChat,
  onDeleteChat
}) => {
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Evita que o clique no delete selecione o chat
    if (window.confirm('Tem certeza que deseja excluir esta conversa?')) {
      onDeleteChat(chatId);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col border-gray-700 border-r">
      <div className="p-4 border-b border-gray-700">
        <Button 
          onClick={onNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Conversa
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group relative p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
                activeChat === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div 
                className="flex items-center gap-3 pr-8"
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
              </div>
              
              {/* Botão de delete */}
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-200"
                title="Excluir conversa"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;