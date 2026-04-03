import { X, Wallet } from 'lucide-react';
import { useState } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const wallets = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️' },
  { id: 'binance', name: 'Binance Wallet', icon: '🔶' },
];

export function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [connecting, setConnecting] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async (_walletId: string) => {
    setConnecting(true);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock address
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 14) + '...' + Math.random().toString(16).slice(2, 6);
    onConnect(mockAddress);
    setConnecting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-dark-light rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">连接钱包</h2>
          <p className="text-gray-400 text-sm">选择您要连接的钱包</p>
        </div>
        
        {/* Wallet List */}
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={connecting}
              className="w-full flex items-center gap-4 p-4 bg-dark-lighter rounded-xl hover:bg-dark transition-colors disabled:opacity-50"
            >
              <span className="text-2xl">{wallet.icon}</span>
              <span className="flex-1 text-left font-medium text-white">{wallet.name}</span>
              {connecting && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          连接即表示您同意我们的服务条款
        </p>
      </div>
    </div>
  );
}
