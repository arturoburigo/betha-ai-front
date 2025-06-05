
import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const STORAGE_KEY = 'chat-history';

const ChatInterface: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        const savedChats = localStorage.getItem(STORAGE_KEY);
        if (savedChats) {
          const parsedChats = JSON.parse(savedChats);
          // Converter strings de timestamp de volta para objetos Date
          const chatsWithDates = parsedChats.map((chat: any) => ({
            ...chat,
            timestamp: new Date(chat.timestamp),
            messages: chat.messages.map((message: any) => ({
              ...message,
              timestamp: new Date(message.timestamp)
            }))
          }));
          setChats(chatsWithDates);
          
          // Definir o primeiro chat como ativo se existir
          if (chatsWithDates.length > 0) {
            setActiveChat(chatsWithDates[0].id);
          }
        } else {
          // Criar chat inicial se não houver histórico
          const initialChat: Chat = {
            id: '1',
            title: 'Conversa de exemplo',
            lastMessage: 'Olá! Como posso ajudar?',
            timestamp: new Date(),
            messages: [
              {
                id: '1',
                content: 'Olá! Como posso ajudar você hoje?',
                sender: 'assistant',
                timestamp: new Date(),
              }
            ]
          };
          setChats([initialChat]);
          setActiveChat('1');
        }
      } catch (error) {
        console.error('Erro ao carregar histórico do chat:', error);
        // Em caso de erro, criar chat inicial
        const initialChat: Chat = {
          id: '1',
          title: 'Conversa de exemplo',
          lastMessage: 'Olá! Como posso ajudar?',
          timestamp: new Date(),
          messages: [
            {
              id: '1',
              content: 'Olá! Como posso ajudar você hoje?',
              sender: 'assistant',
              timestamp: new Date(),
            }
          ]
        };
        setChats([initialChat]);
        setActiveChat('1');
      }
    };

    loadChatHistory();
  }, []);

  // Salvar no localStorage sempre que chats mudarem
  useEffect(() => {
    if (chats.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      } catch (error) {
        console.error('Erro ao salvar histórico do chat:', error);
      }
    }
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeChat]);

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat);
  };

  const simulateAssistantResponse = async (userMessage: string): Promise<string> => {
    // Simula diferentes tipos de resposta baseado na mensagem
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responses = [
      "Entendo sua pergunta. Vou ajudar você com isso da melhor forma possível!",
      "Essa é uma questão interessante. Deixe-me explicar de forma detalhada...",
      "Posso ajudar com isso! Aqui está uma resposta abrangente para sua dúvida.",
      "Ótima pergunta! Vou fornecer algumas informações úteis sobre esse tópico.",
      "Claro! Aqui está o que posso te dizer sobre isso..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat || isLoading) return;

    setIsLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    // Adiciona mensagem do usuário e loading
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage, loadingMessage],
              lastMessage: content,
              timestamp: new Date(),
            }
          : chat
      )
    );

    try {
      const assistantResponse = await simulateAssistantResponse(content);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: assistantResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      // Remove loading e adiciona resposta real
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages.filter(m => !m.isLoading), assistantMessage],
                lastMessage: assistantResponse,
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Erro ao obter resposta:', error);
      
      // Remove loading em caso de erro
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.filter(m => !m.isLoading),
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      lastMessage: 'Conversa iniciada',
      timestamp: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          content: 'Olá! Como posso ajudar você hoje?',
          sender: 'assistant',
          timestamp: new Date(),
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const currentChat = getCurrentChat();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onNewChat={handleNewChat}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl font-semibold text-gray-800">
                {currentChat?.title || 'Chat AI'}
              </h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto py-6">
              {currentChat?.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
