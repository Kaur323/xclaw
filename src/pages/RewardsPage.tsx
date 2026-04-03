import { useState } from 'react';
import { Award, Gift, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { mockRewards, mockTransactions } from '../data/mock';
import { formatNumber, formatDateTime } from '../utils/format';

type RewardTab = 'pending' | 'history' | 'records';
type RewardType = 'all' | 'direct' | 'node' | 'dividend' | 'prediction';

const rewardTypeLabels: Record<string, string> = {
  direct: '直推奖励',
  node: '节点奖励',
  dividend: '分红奖励',
  prediction: '预测收益',
};

const rewardTypeIcons: Record<string, React.ElementType> = {
  direct: Users,
  node: Award,
  dividend: TrendingUp,
  prediction: Gift,
};

export function RewardsPage() {
  const [activeTab, setActiveTab] = useState<RewardTab>('pending');
  const [filterType, setFilterType] = useState<RewardType>('all');

  const pendingRewards = mockRewards.filter(r => r.status === 'pending');
  const claimedRewards = mockRewards.filter(r => r.status === 'claimed');

  const filteredRewards = filterType === 'all' 
    ? claimedRewards 
    : claimedRewards.filter(r => r.type === filterType);

  const totalPending = pendingRewards.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="pb-24">
      {/* Total Rewards Card */}
      <div className="m-4 p-4 bg-gradient-to-br from-primary/20 via-accent-purple/20 to-accent-blue/20 rounded-2xl border border-primary/30">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-primary" size={20} />
          <span className="font-semibold">我的奖励</span>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-400 mb-1">累计已获得</p>
          <p className="text-3xl font-bold gradient-text">
            ${formatNumber(mockRewards.reduce((sum, r) => sum + (r.status === 'claimed' ? r.amount : 0), 0))}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-yellow-500">${formatNumber(totalPending)}</p>
            <p className="text-xs text-gray-400">待领取</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-500">{mockRewards.filter(r => r.status === 'claimed').length}</p>
            <p className="text-xs text-gray-400">已领取</p>
          </div>
        </div>
      </div>

      {/* Claim All Button */}
      {pendingRewards.length > 0 && (
        <div className="mx-4 mb-4">
          <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
            <Gift size={18} />
            一键领取全部奖励
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
              {pendingRewards.length}
            </span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex px-4 mb-4 border-b border-dark-lighter">
        {[
          { id: 'pending', label: '待领取' },
          { id: 'history', label: '奖励记录' },
          { id: 'records', label: '交易记录' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as RewardTab)}
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

      {/* Filter for history tab */}
      {activeTab === 'history' && (
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: '全部' },
              { id: 'direct', label: '直推' },
              { id: 'node', label: '节点' },
              { id: 'dividend', label: '分红' },
              { id: 'prediction', label: '预测' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id as RewardType)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterType === type.id
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter text-gray-400 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4">
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingRewards.length > 0 ? (
              pendingRewards.map((reward) => {
                const Icon = rewardTypeIcons[reward.type] || Gift;
                return (
                  <div key={reward.id} className="bg-dark-light rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{rewardTypeLabels[reward.type]}</p>
                          <p className="text-xs text-gray-400">{formatDateTime(reward.timestamp)}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        +{reward.amount} {reward.token}
                      </span>
                    </div>
                    <button className="w-full py-2 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors">
                      领取奖励
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <CheckCircle2 size={48} className="mx-auto mb-4 opacity-30" />
                <p>暂无待领取奖励</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {filteredRewards.map((reward) => {
              const Icon = rewardTypeIcons[reward.type] || Gift;
              return (
                <div key={reward.id} className="bg-dark-light rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Icon size={20} className="text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">{rewardTypeLabels[reward.type]}</p>
                        <p className="text-xs text-gray-400">{reward.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">
                        +{reward.amount} {reward.token}
                      </p>
                      <p className="text-xs text-gray-400">{formatDateTime(reward.timestamp)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="bg-dark-light rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'purchase' ? 'bg-primary/20' :
                      tx.type === 'claim' ? 'bg-green-500/20' :
                      'bg-secondary/20'
                    }`}>
                      {tx.type === 'purchase' ? <Gift size={20} className="text-primary" /> :
                       tx.type === 'claim' ? <CheckCircle2 size={20} className="text-green-500" /> :
                       <Award size={20} className="text-secondary" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tx.type === 'purchase' ? '配售认购' :
                         tx.type === 'claim' ? '释放领取' :
                         tx.type === 'reward' ? '奖励领取' :
                         '委托操作'}
                      </p>
                      <p className="text-xs text-gray-400">{formatDateTime(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === 'purchase' ? 'text-white' : 'text-green-500'
                    }`}>
                      {tx.type === 'purchase' ? '-' : '+'}{tx.amount} {tx.token}
                    </p>
                    <span className={`text-xs ${
                      tx.status === 'completed' ? 'text-green-500' :
                      tx.status === 'pending' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {tx.status === 'completed' ? '已完成' :
                       tx.status === 'pending' ? '处理中' :
                       '失败'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
