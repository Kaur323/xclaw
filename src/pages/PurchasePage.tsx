import { useState } from 'react';
import { Gift, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockPurchases, mockPurchaseStats } from '../data/mock';
import { formatNumber } from '../utils/format';

type PurchaseTab = 'ongoing' | 'ended' | 'upcoming';

export function PurchasePage() {
  const [activeTab, setActiveTab] = useState<PurchaseTab>('ongoing');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const tabs: { id: PurchaseTab; label: string }[] = [
    { id: 'ongoing', label: '进行中' },
    { id: 'ended', label: '已结束' },
    { id: 'upcoming', label: '即将开放' },
  ];

  return (
    <div className="pb-24">
      {/* Stats Card */}
      <div className="m-4 p-4 bg-gradient-to-br from-primary/20 to-accent-purple/20 rounded-2xl border border-primary/30">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="text-primary" size={20} />
          <span className="font-semibold">我的配售</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark/50 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">累计认购</p>
            <p className="text-xl font-bold text-white">{mockPurchaseStats.totalPurchased} BNB</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">已释放</p>
            <p className="text-xl font-bold text-primary">{formatNumber(mockPurchaseStats.totalReleased)}</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">待释放</p>
            <p className="text-xl font-bold text-secondary">{formatNumber(mockPurchaseStats.pendingRelease)}</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">今日交易量</p>
            <p className={`text-xl font-bold ${mockPurchaseStats.isVolumeMet ? 'text-green-500' : 'text-yellow-500'}`}>
              ${mockPurchaseStats.dailyVolume}
            </p>
          </div>
        </div>
        
        {!mockPurchaseStats.isVolumeMet && (
          <div className="mt-4 flex items-center gap-2 text-yellow-500 text-sm bg-yellow-500/10 rounded-lg p-2">
            <AlertCircle size={16} />
            <span>今日交易量未达标，需完成 $400 交易量</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 mb-4 border-b border-dark-lighter">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Purchase List */}
      <div className="px-4 space-y-4">
        {activeTab === 'ongoing' && mockPurchases.map((purchase) => (
          <div key={purchase.id} className="bg-dark-light rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-400">认购金额</p>
                <p className="text-lg font-bold">{purchase.amount} BNB</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                进行中
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">释放进度</span>
                <span className="text-primary">{purchase.releasedPercent}%</span>
              </div>
              <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all"
                  style={{ width: `${purchase.releasedPercent}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock size={14} />
                <span>下次释放: {purchase.nextReleaseDate}</span>
              </div>
              <button className="text-primary text-sm font-medium">
                详情
              </button>
            </div>
          </div>
        ))}
        
        {activeTab === 'ongoing' && mockPurchases.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Gift size={48} className="mx-auto mb-4 opacity-30" />
            <p>暂无进行中的配售</p>
          </div>
        )}
        
        {activeTab === 'ended' && (
          <div className="text-center py-12 text-gray-400">
            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-30" />
            <p>暂无已结束的配售</p>
          </div>
        )}
        
        {activeTab === 'upcoming' && (
          <div className="bg-dark-light rounded-2xl p-6 text-center">
            <Clock size={48} className="mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-lg font-semibold mb-2">下一期即将开放</h3>
            <p className="text-gray-400 text-sm mb-4">敬请期待下一期配售活动</p>
            <div className="flex justify-center gap-2">
              <span className="px-4 py-2 bg-dark-lighter rounded-lg text-sm">预计 7 天后</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <button 
          onClick={() => setShowPurchaseModal(true)}
          className="w-full btn-primary py-4 text-lg font-semibold shadow-lg shadow-primary/25"
        >
          立即认购
        </button>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal onClose={() => setShowPurchaseModal(false)} />
      )}
    </div>
  );
}

// Purchase Modal Component
function PurchaseModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);

  const minAmount = 0.2;
  const maxAmount = 5;
  const currentAmount = parseFloat(amount) || 0;

  const handlePurchase = () => {
    setStep(2);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-dark-light rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
        {step === 1 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">认购配售</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">认购金额 (BNB)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full input text-2xl font-bold py-4"
                  min={minAmount}
                  max={maxAmount}
                  step={0.1}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">BNB</span>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>最低: {minAmount} BNB</span>
                <span>最高: {maxAmount} BNB</span>
              </div>
            </div>
            
            <div className="bg-dark-lighter rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">预计获得</span>
                <span className="font-semibold">{formatNumber(currentAmount * 10000000)} XClaw</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">首次释放</span>
                <span className="font-semibold text-primary">20%</span>
              </div>
            </div>
            
            <button
              onClick={handlePurchase}
              disabled={currentAmount < minAmount || currentAmount > maxAmount}
              className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认认购
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">认购成功!</h3>
            <p className="text-gray-400">您已成功认购 {amount} BNB</p>
          </div>
        )}
      </div>
    </div>
  );
}
