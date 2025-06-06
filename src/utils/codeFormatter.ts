
export const formatCodeBlocks = (text: string): string => {
  // Regex para encontrar blocos de código com ```
  const codeBlockRegex = /```[\s\S]*?```/g;
  
  return text.replace(codeBlockRegex, (match) => {
    // Remove os ``` do início e fim
    const codeContent = match.replace(/^```/, '').replace(/```$/, '');
    
    // Adiciona groovy como linguagem padrão
    return '```groovy\n' + codeContent.trim() + '\n```';
  });
};
