import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { apiService } from '../services/apiService';
import { formatCodeBlocks } from '../utils/codeFormatter';

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

  const generateChatTitle = (message: string): string => {
    // Remove palavras muito comuns/genéricas
    const stopWords = [
      'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos',
      'para', 'por', 'com', 'sem', 'em', 'na', 'no', 'nas', 'nos', 'que', 'qual', 'como',
      'quando', 'onde', 'por que', 'porque', 'e', 'ou', 'mas', 'se', 'então', 'já',
      'me', 'te', 'se', 'nos', 'vos', 'lhe', 'lhes', 'meu', 'minha', 'seu', 'sua',
      'olá', 'oi', 'bom', 'dia', 'tarde', 'noite', 'obrigado', 'obrigada', 'por favor',
      'pode', 'poderia', 'gostaria', 'quero', 'preciso', 'help', 'ajuda', 'ajudar'
    ];
    
    // Limpa e divide a mensagem em palavras
    const words = message
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 4); // Pega no máximo 4 palavras significativas
    
    if (words.length === 0) {
      return 'Nova Conversa';
    }
    
    // Capitaliza a primeira letra de cada palavra
    const title = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Limita o tamanho do título
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  };

  const generateAssistantResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('Enviando pergunta para a API:', userMessage);
      const response = await apiService.generateResponse(userMessage);
      console.log('Resposta recebida da API:', response);
      
      // Formatar blocos de código na resposta
      const formattedResponse = formatCodeBlocks(response);
      return formattedResponse;
    } catch (error) {
      console.error('Erro ao obter resposta da API:', error);
      return 'Desculpe, ocorreu um erro ao processar sua pergunta. Verifique se a API está rodando e tente novamente.';
    }
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

    // Verifica se é a primeira mensagem do usuário neste chat
    const currentChat = getCurrentChat();
    const isFirstUserMessage = currentChat?.messages.filter(m => m.sender === 'user').length === 0;
    
    // Gera título baseado na primeira mensagem
    const newTitle = isFirstUserMessage ? generateChatTitle(content) : currentChat?.title;

    // Adiciona mensagem do usuário e loading
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat
          ? {
              ...chat,
              title: newTitle || chat.title,
              messages: [...chat.messages, userMessage, loadingMessage],
              lastMessage: content,
              timestamp: new Date(),
            }
          : chat
      )
    );

    try {
      const assistantResponse = await generateAssistantResponse(content);
      
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
                lastMessage: assistantResponse.substring(0, 50) + '...',
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

  const handleDeleteChat = (chatId: string) => {
    setChats(prevChats => {
      const filteredChats = prevChats.filter(chat => chat.id !== chatId);
      
      // Se o chat ativo foi deletado, selecionar outro chat
      if (chatId === activeChat) {
        if (filteredChats.length > 0) {
          setActiveChat(filteredChats[0].id);
        } else {
          // Se não há mais chats, criar um novo
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
          setActiveChat(newChat.id);
          return [newChat];
        }
      }
      
      return filteredChats;
    });
  };

  const currentChat = getCurrentChat();

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto bg-gray-900">
            <div className="max-w-6xl mx-auto py-6 pb-4">
              {currentChat?.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-auto bg-gray-800 border-t border-gray-700">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;