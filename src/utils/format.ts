// Format address to short form
export const formatAddress = (address: string, start = 6, end = 4): string => {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

// Format number with commas
export const formatNumber = (num: number, decimals = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format currency
export const formatCurrency = (amount: number, symbol = '', decimals = 2): string => {
  const formatted = formatNumber(amount, decimals);
  return symbol ? `${formatted} ${symbol}` : formatted;
};

// Format date
export const formatDate = (timestamp: number | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Format datetime
export const formatDateTime = (timestamp: number | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format relative time
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = timestamp - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days <= 0) return '今天';
  if (days === 1) return '明天';
  if (days < 7) return `${days} 天后`;
  if (days < 30) return `${Math.ceil(days / 7)} 周后`;
  return `${Math.ceil(days / 30)} 个月后`;
};

// Calculate progress percentage
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Generate referral link
export const generateReferralLink = (address: string): string => {
  return `${window.location.origin}?ref=${address}`;
};

// Calculate node progress
export const calculateNodeProgress = (currentVolume: number, requirement: number): number => {
  return Math.min((currentVolume / requirement) * 100, 100);
};

// Format BNB amount
export const formatBNB = (amount: number): string => {
  return `${amount.toFixed(4)} BNB`;
};

// Format USD amount
export const formatUSD = (amount: number): string => {
  return `$${formatNumber(amount, 2)}`;
};
