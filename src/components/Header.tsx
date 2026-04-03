import { Wallet, ChevronLeft } from 'lucide-react';
import { formatAddress } from '../utils/format';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  address?: string;
  onConnect?: () => void;
}

export function Header({ 
  title, 
  showBack = false, 
  onBack, 
  address, 
  onConnect 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-dark/80 backdrop-blur-md border-b border-dark-lighter">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left - Back Button or Placeholder */}
        <div className="w-20">
          {showBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm">返回</span>
            </button>
          )}
        </div>
        
        {/* Center - Title */}
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        
        {/* Right - Wallet */}
        <div className="w-20 flex justify-end">
          {address ? (
            <div className="flex items-center gap-2 bg-dark-lighter rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-300">{formatAddress(address)}</span>
            </div>
          ) : (
            <button 
              onClick={onConnect}
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors"
            >
              <Wallet size={16} />
              <span>连接</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
