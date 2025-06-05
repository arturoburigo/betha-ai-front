
import React from 'react';
import { Loader } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const renderContent = (content: string) => {
    // Dividir o conteúdo em partes: texto normal e blocos de código
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // É um bloco de código
        const codeContent = part.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
        const language = part.match(/^```(\w+)/)?.[1] || 'groovy';
        
        return (
          <div key={index} className="my-3">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-3 py-2 text-xs text-gray-300 font-medium">
                {language}
              </div>
              <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                <code className={`language-${language}`}>{codeContent}</code>
              </pre>
            </div>
          </div>
        );
      } else {
        // É texto normal
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
    });
  };
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl w-full ${isUser ? 'pl-12' : 'pr-12'}`}>
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`rounded-2xl px-6 py-4 ${
              isUser
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-100 text-gray-900'
            } shadow-sm`}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              <div>{renderContent(message.content)}</div>
            )}
          </div>
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
