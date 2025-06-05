
export const formatCodeBlocks = (text: string): string => {
  // Regex para encontrar blocos de código com ```
  const codeBlockRegex = /```[\s\S]*?```/g;
  
  return text.replace(codeBlockRegex, (match) => {
    // Remove os ``` do início e fim
    const codeContent = match.replace(/^```/, '').replace(/```$/, '');
    
    // Se já tem uma linguagem especificada no início, mantém
    if (codeContent.trim().startsWith('groovy') || 
        codeContent.trim().startsWith('java') || 
        codeContent.trim().startsWith('javascript') ||
        codeContent.trim().startsWith('python') ||
        codeContent.trim().startsWith('sql')) {
      return match;
    }
    
    // Adiciona groovy como linguagem padrão
    return '```groovy\n' + codeContent.trim() + '\n```';
  });
};
