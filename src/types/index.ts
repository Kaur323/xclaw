// User Types
export interface User {
  address: string;
  isConnected: boolean;
  balance: string;
  xclawBalance: string;
}

// Purchase Types
export interface Purchase {
  id: string;
  amount: number; // BNB amount
  tokenAmount: number; // XClaw amount
  timestamp: number;
  status: 'active' | 'completed' | 'failed';
  releasedPercent: number;
  nextReleaseDate: string;
}

export interface PurchaseStats {
  totalPurchased: number;
  totalReleased: number;
  pendingRelease: number;
  dailyVolume: number;
  isVolumeMet: boolean;
}

// Prediction Types
export interface PredictionEvent {
  id: string;
  title: string;
  description: string;
  endDate: string;
  totalPool: number;
  participants: number;
  status: 'active' | 'ended';
  category: string;
}

export interface PredictionStake {
  id: string;
  eventId: string;
  amount: number;
  stakeDate: string;
  unlockDate: string;
  status: 'staked' | 'unlocked' | 'claimed';
  rewards: number;
}

// Node Types
export interface NodeLevel {
  level: 1 | 2 | 3 | 4;
  name: string;
  nameEn: string;
  requirement: number; // BNB requirement
  reward: number; // USDT reward
  isLimited: boolean;
  maxCount?: number;
  currentCount: number;
}

export interface UserNode {
  level: number;
  achievedDate: string;
  rewardClaimed: number;
  rewardPending: number;
  directReferrals: number;
  teamVolume: number;
}

// Reward Types
export interface Reward {
  id: string;
  type: 'direct' | 'node' | 'dividend' | 'prediction';
  amount: number;
  token: string;
  timestamp: number;
  status: 'pending' | 'claimed' | 'expired';
  description: string;
}

export interface Referral {
  address: string;
  purchaseAmount: number;
  rewardAmount: number;
  level: number;
  joinDate: string;
}

// Community Types
export interface CommunityStats {
  totalMembers: number;
  directReferrals: number;
  teamMembers: number;
  teamVolume: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'purchase' | 'claim' | 'stake' | 'unstake' | 'reward';
  amount: number;
  token: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  hash?: string;
}

// Tab Types
export type TabType = 'purchase' | 'prediction' | 'openclaw' | 'community' | 'rewards';
