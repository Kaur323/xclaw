import { useState } from 'react';
import { TabBar } from './components/TabBar';
import { Header } from './components/Header';
import { WalletModal } from './components/WalletModal';
import { PurchasePage } from './pages/PurchasePage';
import { PredictionPage } from './pages/PredictionPage';
import { OpenClawPage } from './pages/OpenClawPage';
import { CommunityPage } from './pages/CommunityPage';
import { RewardsPage } from './pages/RewardsPage';
import type { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('purchase');
  const [address, setAddress] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnect = (addr: string) => {
    setAddress(addr);
  };

  const getPageTitle = (tab: TabType): string => {
    switch (tab) {
      case 'purchase': return '先锋配售';
      case 'prediction': return '预测市场';
      case 'openclaw': return 'OpenClaw';
      case 'community': return '社区';
      case 'rewards': return '奖励';
      default: return 'XClaw';
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'purchase':
        return <PurchasePage />;
      case 'prediction':
        return <PredictionPage />;
      case 'openclaw':
        return <OpenClawPage />;
      case 'community':
        return <CommunityPage />;
      case 'rewards':
        return <RewardsPage />;
      default:
        return <PurchasePage />;
    }
  };

  return (
    <div className="min-h-screen bg-dark max-w-md mx-auto relative">
      {/* Header */}
      <Header 
        title={getPageTitle(activeTab)}
        address={address}
        onConnect={() => setShowWalletModal(true)}
      />

      {/* Main Content */}
      <main className="pt-14">
        {renderPage()}
      </main>

      {/* TabBar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleConnect}
      />
    </div>
  );
}

export default App;
