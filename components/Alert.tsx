import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface AlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Alert;