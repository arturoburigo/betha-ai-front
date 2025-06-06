import React, { useState } from 'react';
import { Loader, Copy, Check } from 'lucide-react';

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
  const [copiedStates, setCopiedStates] = useState<{[key: number]: boolean}>({});
  
  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };
  
  const renderContent = (content: string) => {
    // Dividir o conteúdo em partes: texto normal e blocos de código
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // É um bloco de código
        let codeContent = part.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
        
        // Remove "bfc-script" do início se estiver presente
        codeContent = codeContent.replace(/^bfc-script\s*\n?/, '');
        
        const language = part.match(/^```(\w+)/)?.[1] || 'groovy';
        const isCopied = copiedStates[index] || false;
        
        return (
          <div key={index} className="w-full">
            <div className="bg-gray-900 rounded-lg overflow-hidden max-w-full">
              <div className="bg-gray-800 px-3 py-2 flex justify-between items-center">
                <span className="text-xs text-gray-300 font-medium">{language}</span>
                <button
                  onClick={() => copyToClipboard(codeContent, index)}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  title="Copiar código"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="max-w-full overflow-x-auto">
                <pre className="p-4 text-sm whitespace-pre leading-relaxed text-gray-100">
                  <code 
                    className={`language-${language}`}
                    style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                  >
                    {codeContent}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );
      } else {
        // É texto normal
        return (
          <span key={index} className="whitespace-pre-wrap break-words">
            {part}
          </span>
        );
      }
    });
  };
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-5xl w-full ${isUser ? 'pl-8' : 'pr-8'}`}>
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`rounded-2xl px-6 py-4 ${
              isUser
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-800 text-gray-100 border border-gray-700'
            } shadow-sm max-w-full overflow-hidden`}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <div className="flex gap-1">
                  <div className={`w-2 h-2 ${isUser ? 'bg-blue-200' : 'bg-gray-400'} rounded-full animate-typing`}></div>
                  <div className={`w-2 h-2 ${isUser ? 'bg-blue-200' : 'bg-gray-400'} rounded-full animate-typing`} style={{ animationDelay: '0.2s' }}></div>
                  <div className={`w-2 h-2 ${isUser ? 'bg-blue-200' : 'bg-gray-400'} rounded-full animate-typing`} style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-hidden">{renderContent(message.content)}</div>
            )}
          </div>
        </div>
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;