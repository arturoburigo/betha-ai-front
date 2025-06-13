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
  
  const parseMarkdown = (text: string) => {
    // Processa markdown inline: **bold**, `code`, etc.
    const processInlineMarkdown = (str: string) => {
      const parts = [];
      let lastIndex = 0;
      
      // Padrões de markdown inline
      const patterns = [
        { regex: /\*\*(.*?)\*\*/g, render: (content: string, key: number) => 
          <strong key={key} className="font-semibold text-blue-300">{content}</strong> 
        },
        { regex: /`([^`]+)`/g, render: (content: string, key: number) => 
          <code key={key} className="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {content}
          </code> 
        }
      ];
      
      // Encontra todas as correspondências
      const matches = [];
      patterns.forEach((pattern, patternIndex) => {
        let match;
        while ((match = pattern.regex.exec(str)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[1],
            render: pattern.render,
            patternIndex
          });
        }
      });
      
      // Ordena por posição
      matches.sort((a, b) => a.start - b.start);
      
      // Constrói o resultado
      let keyCounter = 0;
      matches.forEach(match => {
        // Adiciona texto antes da match
        if (match.start > lastIndex) {
          parts.push(str.substring(lastIndex, match.start));
        }
        
        // Adiciona elemento formatado
        parts.push(match.render(match.content, keyCounter++));
        lastIndex = match.end;
      });
      
      // Adiciona texto restante
      if (lastIndex < str.length) {
        parts.push(str.substring(lastIndex));
      }
      
      return parts.length > 1 ? parts : str;
    };
    
    // Divide em linhas e processa cada uma
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Headers (###, ##, #)
      if (trimmedLine.startsWith('### ')) {
        const headerContent = trimmedLine.substring(4);
        return (
          <h3 key={index} className="text-lg font-semibold text-blue-300 mt-4 mb-2 leading-relaxed">
            {processInlineMarkdown(headerContent)}
          </h3>
        );
      } else if (trimmedLine.startsWith('## ')) {
        const headerContent = trimmedLine.substring(3);
        return (
          <h2 key={index} className="text-xl font-semibold text-blue-300 mt-4 mb-2 leading-relaxed">
            {processInlineMarkdown(headerContent)}
          </h2>
        );
      } else if (trimmedLine.startsWith('# ')) {
        const headerContent = trimmedLine.substring(2);
        return (
          <h1 key={index} className="text-2xl font-bold text-blue-300 mt-4 mb-3 leading-relaxed">
            {processInlineMarkdown(headerContent)}
          </h1>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        // Item de lista
        const listContent = trimmedLine.substring(2);
        return (
          <div key={index} className="flex items-start gap-3 my-1.5 ml-2">
            <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">•</span>
            <span className="flex-1 leading-relaxed">{processInlineMarkdown(listContent)}</span>
          </div>
        );
      } else if (trimmedLine) {
        // Linha normal
        return (
          <div key={index} className="my-1 leading-relaxed">
            {processInlineMarkdown(trimmedLine)}
          </div>
        );
      } else {
        // Linha vazia
        return <div key={index} className="h-3" />;
      }
    });
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
        
        const language =  'groovy';
        const isCopied = copiedStates[index] || false;
        
        return (
          <div key={index} className="my-3 w-full">
            <div className="bg-gray-900 rounded-lg overflow-hidden max-w-full">
              <div className="bg-blue-900 px-3 py-2 flex justify-between items-center">
                <span className="text-xs text-gray-300 font-medium">{language}</span>
                <button
                  onClick={() => copyToClipboard(codeContent, index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
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
              <div className="max-w-full overflow-x-auto ">
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
        // É texto normal - processa markdown
        return (
          <div key={index} className="whitespace-normal break-words">
            {parseMarkdown(part)}
          </div>
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
                <span className="text-sm font-medium ml-2">
                  <span className="animate-color-wave-1">Tudo</span>{' '}
                  <span className="animate-color-wave-2">que</span>{' '}
                  <span className="animate-color-wave-3">sua</span>{' '}
                  <span className="animate-color-wave-4">cidade</span>{' '}
                  <span className="animate-color-wave-5">pode</span>{' '}
                  <span className="animate-color-wave-6">se</span>{' '}
                  <span className="animate-color-wave-7">tornar...</span>
                </span>                <div className="flex gap-1">
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