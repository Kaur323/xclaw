#!/usr/bin/env python3
"""
Polymarket 自动追踪与跟单策略系统
功能：
1. 定期扫描目标地址的交易活动
2. 分析交易逻辑和选标方法
3. 交叉验证多个地址的信号
4. 生成跟单建议
"""

import json
import requests
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Set
from dataclasses import dataclass, asdict
from collections import defaultdict

# 目标追踪地址（从分析结果中选出的优质地址）
TARGET_ADDRESSES = [
    {
        "address": "0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee",
        "name": "kch123",
        "strategy": "量化套利型",
        "weight": 1.0
    },
    {
        "address": "0xefbc5fec8d7b0acdc8911bdd9a98d6964308f9a2",
        "name": "reachingthesky",
        "strategy": "趋势跟踪型",
        "weight": 1.2  # 强烈推荐，权重更高
    },
    {
        "address": "0x019782cab5d844f02bafb71f512758be78579f3c",
        "name": "majorexploiter",
        "strategy": "价值投资型",
        "weight": 1.2  # 强烈推荐
    },
    {
        "address": "0xc2e7800b5af46e6093872b177b7a5e7f0563be51",
        "name": "beachboy4",
        "strategy": "趋势跟踪型",
        "weight": 1.0
    },
    {
        "address": "0xdc876e6873772d38716fda7f2452a78d426d7ab6",
        "name": "432614799197",
        "strategy": "量化套利型",
        "weight": 1.0
    }
]

@dataclass
class MarketSignal:
    """市场信号"""
    market_id: str
    market_title: str
    category: str
    direction: str  # YES / NO
    confidence: float  # 0-100
    supporting_traders: List[str]
    opposing_traders: List[str]
    recommendation: str
    urgency: str  # immediate / high / medium / low

@dataclass
class TraderActivity:
    """交易者活动"""
    trader_address: str
    trader_name: str
    timestamp: str
    action: str  # BUY / SELL
    market_id: str
    market_title: str
    outcome: str  # YES / NO
    amount: float
    price: float

class PolymarketTracker:
    """Polymarket 追踪器"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.api_base = "https://data-api.polymarket.com/v1"
    
    def get_trader_positions(self, address: str) -> List[Dict]:
        """获取交易者的当前持仓"""
        url = f"{self.api_base}/portfolio/{address}"
        try:
            response = self.session.get(url, timeout=30)
            if response.status_code == 200:
                return response.json().get('positions', [])
            return []
        except Exception as e:
            print(f"获取持仓失败 {address[:10]}...: {e}")
            return []
    
    def get_trader_activity(self, address: str, limit: int = 50) -> List[TraderActivity]:
        """获取交易者的最近活动"""
        url = f"{self.api_base}/activity/{address}"
        params = {"limit": limit}
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            if response.status_code != 200:
                return []
            
            data = response.json()
            activities = []
            
            for item in data.get('activities', []):
                activity = TraderActivity(
                    trader_address=address,
                    trader_name=next((t['name'] for t in TARGET_ADDRESSES if t['address'].lower() == address.lower()), 'Unknown'),
                    timestamp=item.get('timestamp', ''),
                    action=item.get('action', ''),
                    market_id=item.get('marketId', ''),
                    market_title=item.get('marketTitle', ''),
                    outcome=item.get('outcome', ''),
                    amount=float(item.get('amount', 0)),
                    price=float(item.get('price', 0))
                )
                activities.append(activity)
            
            return activities
        except Exception as e:
            print(f"获取活动失败 {address[:10]}...: {e}")
            return []
    
    def analyze_market_consensus(self, activities: List[TraderActivity]) -> List[MarketSignal]:
        """分析市场共识信号"""
        
        # 按市场分组
        market_votes = defaultdict(lambda: {'YES': [], 'NO': []})
        
        for activity in activities:
            if activity.action == 'BUY':
                market_votes[activity.market_id][activity.outcome].append(activity)
        
        signals = []
        
        for market_id, votes in market_votes.items():
            yes_traders = [a.trader_name for a in votes['YES']]
            no_traders = [a.trader_name for a in votes['NO']]
            
            # 获取市场标题
            market_title = votes['YES'][0].market_title if votes['YES'] else votes['NO'][0].market_title if votes['NO'] else market_id
            
            # 计算共识度
            total_votes = len(yes_traders) + len(no_traders)
            if total_votes < 2:  # 至少需要2个地址参与
                continue
            
            yes_weight = len(yes_traders) / total_votes * 100
            no_weight = len(no_traders) / total_votes * 100
            
            # 生成信号
            if yes_weight >= 60 and len(yes_traders) >= 2:
                signal = MarketSignal(
                    market_id=market_id,
                    market_title=market_title,
                    category="待分析",
                    direction="YES",
                    confidence=yes_weight,
                    supporting_traders=yes_traders,
                    opposing_traders=no_traders,
                    recommendation="强烈看多",
                    urgency="high" if yes_weight >= 80 else "medium"
                )
                signals.append(signal)
            
            elif no_weight >= 60 and len(no_traders) >= 2:
                signal = MarketSignal(
                    market_id=market_id,
                    market_title=market_title,
                    category="待分析",
                    direction="NO",
                    confidence=no_weight,
                    supporting_traders=no_traders,
                    opposing_traders=yes_traders,
                    recommendation="强烈看空",
                    urgency="high" if no_weight >= 80 else "medium"
                )
                signals.append(signal)
        
        # 按置信度排序
        signals.sort(key=lambda x: x.confidence, reverse=True)
        return signals
    
    def filter_long_term_markets(self, signals: List[MarketSignal]) -> List[MarketSignal]:
        """过滤长期市场（排除短期波动大的标的）"""
        filtered = []
        
        for signal in signals:
            # 排除明显是短期事件的市场
            short_term_keywords = ['minutes', 'hour', 'today', 'tonight', 'this hour']
            title_lower = signal.market_title.lower()
            
            if any(keyword in title_lower for keyword in short_term_keywords):
                continue
            
            # 保留政治、体育赛季、经济事件等长期标的
            long_term_keywords = ['election', 'president', 'championship', 'season', '2025', '2026']
            if any(keyword in title_lower for keyword in long_term_keywords):
                signal.urgency = "low"  # 长期标的不紧急
                filtered.append(signal)
            else:
                filtered.append(signal)
        
        return filtered
    
    def generate_trading_strategy(self, signals: List[MarketSignal]) -> Dict[str, Any]:
        """生成交易策略建议"""
        
        if not signals:
            return {
                "action": "HOLD",
                "reason": "暂无明确共识信号",
                "signals": []
            }
        
        # 选择前3个最强信号
        top_signals = signals[:3]
        
        strategy = {
            "action": "TRADE",
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_signals": len(signals),
                "high_confidence": len([s for s in signals if s.confidence >= 80]),
                "medium_confidence": len([s for s in signals if 60 <= s.confidence < 80])
            },
            "recommendations": []
        }
        
        for signal in top_signals:
            rec = {
                "market": signal.market_title[:50] + "..." if len(signal.market_title) > 50 else signal.market_title,
                "direction": signal.direction,
                "confidence": f"{signal.confidence:.1f}%",
                "urgency": signal.urgency,
                "supporting": signal.supporting_traders,
                "opposing": signal.opposing_traders,
                "allocation": "20-30%" if signal.confidence >= 80 else "10-15%",
                "rationale": f"{len(signal.supporting_traders)}个追踪地址一致看多" if signal.direction == "YES" else f"{len(signal.supporting_traders)}个追踪地址一致看空"
            }
            strategy["recommendations"].append(rec)
        
        return strategy
    
    def run_scan(self) -> Dict[str, Any]:
        """运行完整扫描"""
        
        print("🔍 开始扫描目标地址...")
        all_activities = []
        
        for target in TARGET_ADDRESSES:
            print(f"  📊 扫描 {target['name']}...")
            activities = self.get_trader_activity(target['address'], limit=20)
            all_activities.extend(activities)
            time.sleep(0.5)  # 避免请求过快
        
        print(f"✅ 获取到 {len(all_activities)} 条交易记录")
        
        # 只分析最近4小时的活动
        cutoff_time = datetime.now() - timedelta(hours=4)
        recent_activities = [
            a for a in all_activities 
            if datetime.fromisoformat(a.timestamp.replace('Z', '+00:00')) > cutoff_time
        ]
        
        print(f"📅 最近4小时活动: {len(recent_activities)} 条")
        
        # 分析共识
        signals = self.analyze_market_consensus(recent_activities)
        print(f"🎯 发现 {len(signals)} 个共识信号")
        
        # 过滤长期市场
        long_term_signals = self.filter_long_term_markets(signals)
        print(f"📈 长期可投标的: {len(long_term_signals)} 个")
        
        # 生成策略
        strategy = self.generate_trading_strategy(long_term_signals)
        
        return {
            "scan_time": datetime.now().isoformat(),
            "activities_scanned": len(all_activities),
            "recent_activities": len(recent_activities),
            "signals_found": len(signals),
            "long_term_signals": len(long_term_signals),
            "strategy": strategy
        }


def main():
    """主函数"""
    print("=" * 70)
    print("🦞 Polymarket 自动追踪与跟单策略系统")
    print("=" * 70)
    print(f"⏰ 扫描时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 70)
    
    tracker = PolymarketTracker()
    result = tracker.run_scan()
    
    print("\n" + "=" * 70)
    print("📋 扫描结果")
    print("=" * 70)
    print(f"扫描活动数: {result['activities_scanned']}")
    print(f"近期活动: {result['recent_activities']}")
    print(f"共识信号: {result['signals_found']}")
    print(f"长期标的: {result['long_term_signals']}")
    
    strategy = result['strategy']
    print(f"\n🎯 建议操作: {strategy['action']}")
    
    if strategy['action'] == 'TRADE':
        print("\n📊 交易建议:")
        print("-" * 70)
        for i, rec in enumerate(strategy['recommendations'], 1):
            print(f"\n{i}. {rec['market']}")
            print(f"   方向: {'🟢 看多' if rec['direction'] == 'YES' else '🔴 看空'} {rec['direction']}")
            print(f"   置信度: {rec['confidence']}")
            print(f"   紧急度: {rec['urgency']}")
            print(f"   支持地址: {', '.join(rec['supporting'])}")
            print(f"   反对地址: {', '.join(rec['opposing']) if rec['opposing'] else '无'}")
            print(f"   建议仓位: {rec['allocation']}")
            print(f"   理由: {rec['rationale']}")
    else:
        print(f"\n💡 {strategy['reason']}")
    
    # 保存结果
    filename = f"polymarket_scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 结果已保存: {filename}")
    print("=" * 70)


if __name__ == "__main__":
    main()
