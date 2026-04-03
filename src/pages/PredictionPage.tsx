import { useState } from 'react';
import { TrendingUp, Clock, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { mockPredictionEvents, mockPredictionStakes } from '../data/mock';
import { formatDate, formatUSD } from '../utils/format';

type PredictionTab = 'events' | 'my-stakes';

export function PredictionPage() {
  const [activeTab, setActiveTab] = useState<PredictionTab>('events');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);

  return (
    <div className="pb-24">
      {/* Header Stats */}
      <div className="m-4 p-4 bg-gradient-to-br from-secondary/20 to-accent-blue/20 rounded-2xl border border-secondary/30">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-secondary" size={20} />
          <span className="font-semibold">预测市场</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-xs mb-1">我的委托</p>
            <p className="text-lg font-bold text-white">{mockPredictionStakes.length} 份</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-xs mb-1">累计收益</p>
            <p className="text-lg font-bold text-secondary">0 XClaw</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-xs mb-1">参与事件</p>
            <p className="text-lg font-bold text-accent-blue">{mockPredictionEvents.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 mb-4 border-b border-dark-lighter">
        {[
          { id: 'events', label: '热门事件' },
          { id: 'my-stakes', label: '我的委托' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PredictionTab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-secondary' : 'text-gray-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-secondary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'events' && (
          <div className="space-y-4">
            {mockPredictionEvents.map((event) => (
              <div key={event.id} className="bg-dark-light rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded mb-2">
                      {event.category}
                    </span>
                    <h3 className="font-semibold text-white">{event.title}</h3>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                    进行中
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>奖池: {formatUSD(event.totalPool)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{event.participants} 人参与</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock size={14} />
                    <span>截止: {formatDate(event.endDate)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedEvent(event.id);
                      setShowStakeModal(true);
                    }}
                    className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-xl hover:bg-secondary-dark transition-colors"
                  >
                    智能委托
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'my-stakes' && (
          <div className="space-y-4">
            {mockPredictionStakes.length > 0 ? (
              mockPredictionStakes.map((stake) => (
                <div key={stake.id} className="bg-dark-light rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-400">委托事件</p>
                      <p className="font-semibold">BTC 将在本周末突破 100K</p>
                    </div>
                    <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                      委托中
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">委托金额</p>
                      <p className="font-semibold">{formatUSD(stake.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">当前收益</p>
                      <p className="font-semibold text-secondary">{stake.rewards} XClaw</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">解锁时间: {stake.unlockDate}</span>
                    <button className="text-secondary font-medium">
                      详情 →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                <p>暂无委托记录</p>
                <p className="text-sm mt-2">参与预测事件获取收益</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <StakeModal 
          event={mockPredictionEvents.find(e => e.id === selectedEvent)!}
          onClose={() => setShowStakeModal(false)} 
        />
      )}
    </div>
  );
}

// Stake Modal Component
function StakeModal({ event, onClose }: { event: typeof mockPredictionEvents[0]; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const handleStake = () => {
    setConfirmed(true);
    setTimeout(() => {
      setStep(2);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-dark-light rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
        {step === 1 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">智能委托</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="bg-dark-lighter rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-400">{event.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-secondary/20 to-accent-blue/20 rounded-xl p-4 mb-6 border border-secondary/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">委托金额</span>
                <span className="text-xl font-bold">$1,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">预计获得代币</span>
                <span className="font-semibold">价值 1000U 的 XClaw</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 bg-dark-lighter text-secondary focus:ring-secondary"
                />
                <span className="text-sm text-gray-400">
                  我了解委托风险，确认进行委托。委托后可在后台设置的周期后退出。
                </span>
              </label>
            </div>
            
            <button
              onClick={handleStake}
              disabled={!confirmed}
              className="w-full btn-primary py-4 bg-secondary hover:bg-secondary-dark disabled:opacity-50"
            >
              确认委托
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">委托成功!</h3>
            <p className="text-gray-400 mb-4">您已成功委托 $1,000</p>
            <button onClick={onClose} className="btn-secondary px-8">
              完成
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
