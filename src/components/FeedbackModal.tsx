import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAdQ7YegM/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zLymrgX5679SMGj2mu1cht16wpiKXDLfAG92sp6aFY0";

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Novo feedback do BethaSeek!\nEmail: ${email}\nMensagem: ${feedback}`
        })
      });
      if (!res.ok) throw new Error('Erro ao enviar feedback');
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail('');
        setFeedback('');
        onClose();
      }, 2000);
    } catch (err) {
      setError('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 relative shadow-2xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-bold text-white mb-2 text-center">Ajude nos a melhorar o projeto!</h2>
        <p className="text-gray-300 mb-6 text-center">Sugestões, críticas e elogios são bem-vindos!</p>
        {sent ? (
          <div className="text-green-400 text-center font-semibold py-8">Obrigado pelo feedback! 💙</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-1" htmlFor="feedback">Feedback:</label>
              <textarea
                id="feedback"
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                required
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-400 text-center text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors mt-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal; 