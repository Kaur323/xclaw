import { useState } from 'react';
import { Bot, Sparkles, MessageSquare, Zap, Shield } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function OpenClawPage() {
  const [isActivated, setIsActivated] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 OpenClaw AI 助手。我可以帮你分析市场、预测趋势、管理你的投资组合。请先激活服务以开始使用。',
      timestamp: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isActivated) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '我理解你的问题。作为 AI 助手，我可以帮助你分析 XClaw 的市场表现、预测价格趋势，或者解答关于节点体系和奖励机制的问题。有什么具体想了解的吗？',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleActivate = () => {
    setShowActivateModal(true);
  };

  const confirmActivate = () => {
    setIsActivated(true);
    setShowActivateModal(false);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: '恭喜！OpenClaw 服务已激活。现在你可以随时向我提问了。我可以帮你分析市场数据、预测趋势、或者管理你的投资组合。',
      timestamp: Date.now(),
    }]);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {!isActivated ? (
        // Activation View
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-purple rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
            <Bot size={48} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">OpenClaw AI</h2>
          <p className="text-gray-400 text-center mb-8 max-w-xs">
            你的智能投资助手，提供市场分析、趋势预测和投资建议
          </p>
          
          <div className="w-full max-w-sm space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 bg-dark-light rounded-xl">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Sparkles size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">智能分析</p>
                <p className="text-xs text-gray-400">实时市场数据分析</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-dark-light rounded-xl">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">趋势预测</p>
                <p className="text-xs text-gray-400">AI 驱动的价格预测</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-dark-light rounded-xl">
              <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-accent-purple" />
              </div>
              <div className="flex-1">
                <p className="font-medium">风险管理</p>
                <p className="text-xs text-gray-400">投资组合优化建议</p>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-4 p-4 bg-dark-light rounded-xl">
              <span className="text-gray-400">激活费用</span>
              <span className="text-xl font-bold">10 USDT</span>
            </div>
            
            <button 
              onClick={handleActivate}
              className="w-full btn-primary py-4 text-lg font-semibold"
            >
              立即激活
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              激活后即可免费使用基础功能
            </p>
          </div>
        </div>
      ) : (
        // Chat View
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-dark-light text-white rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center mr-2">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-dark-light p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-dark-lighter">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="输入你的问题..."
                className="flex-1 input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-primary text-white rounded-xl disabled:opacity-50"
              >
                <MessageSquare size={20} />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {['分析市场', '预测价格', '节点建议', '收益计算'].map((action) => (
                <button
                  key={action}
                  onClick={() => setInputMessage(action)}
                  className="px-3 py-1.5 bg-dark-lighter text-gray-300 text-sm rounded-full whitespace-nowrap hover:bg-dark-light transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Activation Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowActivateModal(false)} />
          
          <div className="relative w-full max-w-sm bg-dark-light rounded-3xl p-6 m-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">激活 OpenClaw</h3>
              <p className="text-gray-400 text-sm">支付 10 USDT 激活 AI 助手服务</p>
            </div>
            
            <div className="bg-dark-lighter rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">激活费用</span>
                <span>10 USDT</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Gas 费用</span>
                <span>~0.001 BNB</span>
              </div>
              <div className="border-t border-dark-light pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>总计</span>
                  <span className="text-primary">10 USDT</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowActivateModal(false)}
                className="flex-1 py-3 bg-dark-lighter text-white rounded-xl font-medium"
              >
                取消
              </button>
              <button 
                onClick={confirmActivate}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
