import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const Header: React.FC = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleSupportClick = () => {
    window.open('https://chat.google.com/u/0/?chat=arturo.burigo@betha.com.br', '_blank');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-sm">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/betha-logo.png" 
              alt="Betha Sistemas" 
              className="rounded-lg w-14 h-14"
            />
            <h1 className="text-2xl font-bold text-gray-100 ml-4">
              BethaSeek
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition-colors"
              onClick={handleSupportClick}
            >
              Suporte
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition-colors"
              onClick={() => setFeedbackOpen(true)}
            >
              Dê um feedback
            </button>
          </div>
        </div>
      </div>
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </header>
  );
};

export default Header;