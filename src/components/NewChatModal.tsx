import React from 'react';

interface WelcomeMessageProps {
  onClose: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <div className="bg-gray-800 rounded-xl p-2 relative shadow-xl border border-gray-700">
        <div className="text-center">
          <img
            src="/beth.png"
            alt="Welcome"
            className="w-40 h-40 mx-auto mb-2 rounded-full border-4 border-blue-500 shadow-lg"
          />
          
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
            <span className="text-blue-400">✨</span>
            Bem vindo ao BethaSeek!
            <span className="text-blue-400">✨</span>
          </h2>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-200 mb-4 leading-relaxed">
              O BethaSeek é um assistente de IA que ajuda você a criar scripts e relatórios de forma rápida e eficiente.
            </p>
            
            <div className="bg-gray-800 rounded-lg p-3 border border-yellow-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>⚠️</span> Informações importantes
              </h3>
              
              <div className="space-y-2 text-gray-300">
                <p className="font-medium text-gray-200">No momento, o BethaSeek está em fase de teste. Ao criar prompts, tenha em mente que:</p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">1.</span>
                    <p>O prompt deve ser genérico. Ao invés de enviar <span className="text-red-400 font-bold">"crie um script que traga o evento 23"</span>, utilize <span className="text-green-400 font-bold">"crie um script que filtre por código do evento"</span>.</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">2.</span>
                    <p>Atualmente o chat <span className="text-yellow-400 font-bold">não possui histórico de conversa</span>. Se precisar de informações anteriores, você deve perguntar sobre o assunto novamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <button
            onClick={onClose}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2 mx-auto"
          >
            <span>🚀</span> Começar a usar
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage; 