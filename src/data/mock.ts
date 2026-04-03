import type { 
  User, Purchase, PurchaseStats, PredictionEvent, PredictionStake,
  NodeLevel, UserNode, Reward, Referral, CommunityStats, Transaction 
} from '../types';

// Mock User Data
export const mockUser: User = {
  address: '0x1234...5678',
  isConnected: true,
  balance: '12.5',
  xclawBalance: '5000000',
};

// Mock Purchase Data
export const mockPurchases: Purchase[] = [
  {
    id: '1',
    amount: 2.5,
    tokenAmount: 25000000,
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: 'active',
    releasedPercent: 30,
    nextReleaseDate: '2026-04-10',
  },
  {
    id: '2',
    amount: 1.0,
    tokenAmount: 10000000,
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    status: 'active',
    releasedPercent: 40,
    nextReleaseDate: '2026-04-10',
  },
];

export const mockPurchaseStats: PurchaseStats = {
  totalPurchased: 3.5,
  totalReleased: 10500000,
  pendingRelease: 24500000,
  dailyVolume: 350,
  isVolumeMet: false,
};

// Mock Prediction Data
export const mockPredictionEvents: PredictionEvent[] = [
  {
    id: '1',
    title: 'BTC 将在本周末突破 100K',
    description: '预测比特币是否会在本周日 24:00 前突破 100,000 美元',
    endDate: '2026-04-06',
    totalPool: 50000,
    participants: 234,
    status: 'active',
    category: 'Crypto',
  },
  {
    id: '2',
    title: '美联储 4 月是否降息',
    description: '预测美联储是否会在 4 月 FOMC 会议上宣布降息',
    endDate: '2026-04-15',
    totalPool: 120000,
    participants: 567,
    status: 'active',
    category: 'Finance',
  },
  {
    id: '3',
    title: '以太坊 ETF 本周净流入',
    description: '预测以太坊 ETF 本周净流入是否超过 5000 万美元',
    endDate: '2026-04-05',
    totalPool: 30000,
    participants: 189,
    status: 'active',
    category: 'Crypto',
  },
];

export const mockPredictionStakes: PredictionStake[] = [
  {
    id: '1',
    eventId: '1',
    amount: 1000,
    stakeDate: '2026-04-01',
    unlockDate: '2026-04-08',
    status: 'staked',
    rewards: 0,
  },
];

// Mock Node Data
export const mockNodeLevels: NodeLevel[] = [
  {
    level: 1,
    name: '龙虾组长',
    nameEn: 'Gold',
    requirement: 5,
    reward: 200,
    isLimited: false,
    currentCount: 1250,
  },
  {
    level: 2,
    name: '龙虾队长',
    nameEn: 'Diamond',
    requirement: 30,
    reward: 2000,
    isLimited: true,
    maxCount: 50,
    currentCount: 32,
  },
  {
    level: 3,
    name: '龙虾大使',
    nameEn: 'Master',
    requirement: 50,
    reward: 3000,
    isLimited: true,
    maxCount: 30,
    currentCount: 18,
  },
  {
    level: 4,
    name: '龙虾领袖',
    nameEn: 'Grandmaster',
    requirement: 100,
    reward: 5000,
    isLimited: true,
    maxCount: 10,
    currentCount: 6,
  },
];

export const mockUserNode: UserNode = {
  level: 1,
  achievedDate: '2026-03-15',
  rewardClaimed: 200,
  rewardPending: 0,
  directReferrals: 12,
  teamVolume: 8.5,
};

// Mock Reward Data
export const mockRewards: Reward[] = [
  {
    id: '1',
    type: 'direct',
    amount: 0.175,
    token: 'BNB',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'claimed',
    description: '直推奖励 - 0xabcd...ef01',
  },
  {
    id: '2',
    type: 'direct',
    amount: 0.35,
    token: 'BNB',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: 'claimed',
    description: '直推奖励 - 0x1234...5678',
  },
  {
    id: '3',
    type: 'node',
    amount: 200,
    token: 'USDT',
    timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
    status: 'claimed',
    description: 'V1 节点奖励',
  },
];

export const mockReferrals: Referral[] = [
  {
    address: '0xabcd...ef01',
    purchaseAmount: 2.5,
    rewardAmount: 0.175,
    level: 1,
    joinDate: '2026-03-28',
  },
  {
    address: '0x9876...5432',
    purchaseAmount: 5.0,
    rewardAmount: 0.35,
    level: 1,
    joinDate: '2026-03-25',
  },
  {
    address: '0xdef0...1234',
    purchaseAmount: 1.0,
    rewardAmount: 0.07,
    level: 2,
    joinDate: '2026-03-20',
  },
];

// Mock Community Data
export const mockCommunityStats: CommunityStats = {
  totalMembers: 156,
  directReferrals: 12,
  teamMembers: 144,
  teamVolume: 156.8,
};

// Mock Transaction Data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    amount: 2.5,
    token: 'BNB',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: 'completed',
    hash: '0xabc...def',
  },
  {
    id: '2',
    type: 'claim',
    amount: 5000000,
    token: 'XClaw',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: 'completed',
    hash: '0x123...456',
  },
  {
    id: '3',
    type: 'reward',
    amount: 0.175,
    token: 'BNB',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'completed',
    hash: '0x789...012',
  },
];
