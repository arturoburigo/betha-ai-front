export const formatCodeBlocks = (text: string): string => {
  // Regex para encontrar blocos de código com ```
  const codeBlockRegex = /```[\w]*\n?[\s\S]*?\n?```/g;
  
  return text.replace(codeBlockRegex, (match) => {
    // Remove os ``` do início e fim, incluindo possível linguagem
    const codeContent = match
      .replace(/^```[\w]*\n?/, '') // Remove ``` e linguagem do início
      .replace(/\n?```$/, ''); // Remove ``` do fim
    
    // Remove "bfc-script" do início se estiver presente
    const cleanedContent = codeContent.replace(/^bfc-script\s*\n?/, '');
    
    // Sempre força groovy como linguagem
    return '```groovy\n' + cleanedContent.trim() + '\n```';
  });
};

// Função para debug - você pode usar para testar
export const debugCodeBlocks = (text: string): void => {
  const codeBlockRegex = /```[\w]*\n?[\s\S]*?\n?```/g;
  const matches = text.match(codeBlockRegex);
  
  if (matches) {
    console.log('Blocos de código encontrados:', matches);
    console.log('Texto formatado:', formatCodeBlocks(text));
  } else {
    console.log('Nenhum bloco de código encontrado');
  }
};