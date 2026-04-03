import { Gift, TrendingUp, Bot, Users, Award } from 'lucide-react';
import type { TabType } from '../types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'purchase', label: '配售', icon: Gift },
  { id: 'prediction', label: '预测', icon: TrendingUp },
  { id: 'openclaw', label: 'OpenClaw', icon: Bot },
  { id: 'community', label: '社区', icon: Users },
  { id: 'rewards', label: '奖励', icon: Award },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-light border-t border-dark-lighter z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon 
                size={22} 
                className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding for mobile */}
      <div className="h-safe-area-inset-bottom bg-dark-light" />
    </div>
  );
}
