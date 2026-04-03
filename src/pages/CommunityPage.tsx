import { useState } from 'react';
import { Users, UserPlus, Award, Share2 } from 'lucide-react';
import { mockCommunityStats, mockReferrals, mockUserNode } from '../data/mock';
import { mockNodeLevels } from '../data/mock';
import { formatAddress, copyToClipboard, generateReferralLink } from '../utils/format';

type CommunityTab = 'overview' | 'referrals' | 'nodes';

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const link = generateReferralLink('0x1234567890abcdef');
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pb-24">
      {/* Stats Overview */}
      <div className="m-4 p-4 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-2xl border border-accent-purple/30">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-accent-purple" size={20} />
          <span className="font-semibold">我的社区</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{mockCommunityStats.directReferrals}</p>
            <p className="text-xs text-gray-400">直推人数</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-accent-purple">{mockCommunityStats.teamMembers}</p>
            <p className="text-xs text-gray-400">团队人数</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-accent-blue">{mockCommunityStats.teamVolume}</p>
            <p className="text-xs text-gray-400">团队业绩 (BNB)</p>
          </div>
          <div className="bg-dark/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-secondary">V{mockUserNode.level}</p>
            <p className="text-xs text-gray-400">当前等级</p>
          </div>
        </div>
      </div>

      {/* Invite Card */}
      <div className="mx-4 mb-4 p-4 bg-dark-light rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Share2 className="text-primary" size={18} />
            <span className="font-medium">邀请好友</span>
          </div>
          <span className="text-xs text-gray-400">获得 7% 奖励</span>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-dark-lighter rounded-xl px-3 py-2 text-sm text-gray-400 truncate">
            {formatAddress(generateReferralLink('0x1234567890abcdef'), 20, 8)}
          </div>
          <button 
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 mb-4 border-b border-dark-lighter">
        {[
          { id: 'overview', label: '总览' },
          { id: 'referrals', label: '直推列表' },
          { id: 'nodes', label: '节点等级' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CommunityTab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-accent-purple' : 'text-gray-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-purple rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Current Level Card */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">当前等级</p>
                  <p className="text-xl font-bold">{mockNodeLevels[mockUserNode.level - 1]?.name}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">小区业绩</span>
                  <span className="font-medium">{mockUserNode.teamVolume} / {mockNodeLevels[mockUserNode.level]?.requirement || 30} BNB</span>
                </div>
                <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{ width: `${Math.min((mockUserNode.teamVolume / (mockNodeLevels[mockUserNode.level]?.requirement || 30)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  再完成 {(mockNodeLevels[mockUserNode.level]?.requirement || 30) - mockUserNode.teamVolume} BNB 小区业绩可升级
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-light rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">已获得奖励</p>
                <p className="text-xl font-bold text-green-500">${mockUserNode.rewardClaimed}</p>
              </div>
              <div className="bg-dark-light rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">待领取奖励</p>
                <p className="text-xl font-bold text-primary">${mockUserNode.rewardPending}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-3">
            {mockReferrals.map((referral, index) => (
              <div key={index} className="bg-dark-light rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <UserPlus size={14} className="text-primary" />
                    </div>
                    <span className="font-medium">{formatAddress(referral.address)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{referral.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">认购: {referral.purchaseAmount} BNB</span>
                  <span className="text-primary">+{referral.rewardAmount} BNB</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="space-y-3">
            {mockNodeLevels.map((node) => (
              <div 
                key={node.level} 
                className={`rounded-xl p-4 border ${
                  mockUserNode.level === node.level 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                    : 'bg-dark-light border-dark-lighter'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      mockUserNode.level === node.level
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                        : 'bg-dark-lighter'
                    }`}>
                      <Award size={20} className={mockUserNode.level === node.level ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className="font-semibold">{node.name}</p>
                      <p className="text-xs text-gray-400">{node.nameEn}</p>
                    </div>
                  </div>
                  {mockUserNode.level === node.level && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                      当前等级
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">达成条件</span>
                    <span>小区业绩 {node.requirement} BNB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">等级奖励</span>
                    <span className="text-green-500">${node.reward}</span>
                  </div>
                  {node.isLimited && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">名额</span>
                      <span>{node.currentCount} / {node.maxCount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
