#!/usr/bin/env python3
"""
Polymarket 顶级交易者分析与追踪系统
功能：
1. 获取并分析顶级交易者数据
2. 筛选适合追踪的地址（长期稳定盈利）
3. 分析交易策略
4. 定期扫描并生成跟单建议
"""

import json
import requests
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict

# API 配置
POLYMARKET_API = "https://data-api.polymarket.com/v1"

@dataclass
class Trader:
    """交易者数据模型"""
    rank: int
    address: str
    username: str
    pnl: float
    volume: float
    win_rate: Optional[float] = None
    total_positions: Optional[int] = None
    active_positions: Optional[int] = None
    
    # 分析字段
    consistency_score: float = 0.0  # 稳定性评分
    risk_score: float = 0.0  # 风险评分
    recommendation: str = ""  # 推荐等级

@dataclass
class TradingStrategy:
    """交易策略模型"""
    trader_address: str
    strategy_name: str
    key_patterns: List[str]
    risk_level: str
    avg_holding_time: str
    preferred_categories: List[str]
    success_factors: List[str]

class PolymarketAnalyzer:
    """Polymarket 分析器"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get_leaderboard(self, time_period: str = "ALL", limit: int = 100) -> List[Trader]:
        """获取排行榜数据"""
        url = f"{POLYMARKET_API}/leaderboard"
        params = {
            "category": "OVERALL",
            "timePeriod": time_period,
            "orderBy": "PNL",
            "limit": min(limit, 50),  # API 限制最多 50
            "offset": 0
        }
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            traders = []
            for item in data:
                trader = Trader(
                    rank=int(item.get('rank', 0)),
                    address=item.get('proxyWallet', ''),
                    username=item.get('userName', ''),
                    pnl=float(item.get('pnl', 0)),
                    volume=float(item.get('vol', 0))
                )
                traders.append(trader)
            
            return traders
        except Exception as e:
            print(f"获取排行榜失败: {e}")
            return []
    
    def analyze_trader_consistency(self, all_time: Trader, monthly: Trader) -> float:
        """分析交易者的稳定性
        
        评分标准：
        - 月度盈利 / 总盈利 比例（越高越稳定）
        - 交易量活跃度
        - 收益率稳定性
        """
        if all_time.pnl <= 0:
            return 0.0
        
        # 月度贡献度（月度盈利占总盈利的比例）
        monthly_contribution = monthly.pnl / all_time.pnl if all_time.pnl > 0 else 0
        
        # 收益率（PnL / Volume）
        roi_all = all_time.pnl / all_time.volume if all_time.volume > 0 else 0
        roi_monthly = monthly.pnl / monthly.volume if monthly.volume > 0 else 0
        
        # 稳定性评分 (0-100)
        consistency = min(100, (monthly_contribution * 50) + (roi_all * 10000 * 30) + (roi_monthly * 10000 * 20))
        
        return round(consistency, 2)
    
    def calculate_risk_score(self, trader: Trader) -> float:
        """计算风险评分
        
        风险因素：
        - 高交易量但低收益 = 高风险
        - 收益波动大 = 高风险
        """
        if trader.volume == 0:
            return 50.0
        
        roi = trader.pnl / trader.volume
        
        # 低 ROI 但高交易量 = 高风险
        if roi < 0.01 and trader.volume > 10000000:
            return 80.0
        elif roi < 0.02:
            return 60.0
        elif roi > 0.1:
            return 30.0  # 高 ROI = 相对较低风险
        else:
            return 50.0
    
    def select_target_traders(self, all_time_traders: List[Trader], 
                             monthly_traders: List[Trader]) -> List[Trader]:
        """筛选适合追踪的目标交易者"""
        
        # 创建月度交易者字典
        monthly_dict = {t.address: t for t in monthly_traders}
        
        selected = []
        
        for trader in all_time_traders[:50]:  # 只看前50
            monthly_trader = monthly_dict.get(trader.address)
            
            if not monthly_trader:
                continue
            
            # 计算稳定性
            consistency = self.analyze_trader_consistency(trader, monthly_trader)
            risk = self.calculate_risk_score(trader)
            
            trader.consistency_score = consistency
            trader.risk_score = risk
            
            # 筛选条件：
            # 1. 总盈利 > 100万
            # 2. 月度盈利 > 10万（证明近期活跃）
            # 3. 稳定性评分 > 30
            # 4. 风险评分 < 70
            if (trader.pnl > 1000000 and 
                monthly_trader.pnl > 100000 and
                consistency > 30 and
                risk < 70):
                
                # 推荐等级
                if consistency > 60 and risk < 50:
                    trader.recommendation = "强烈推荐"
                elif consistency > 40 and risk < 60:
                    trader.recommendation = "推荐"
                else:
                    trader.recommendation = "观察"
                
                selected.append(trader)
        
        # 按稳定性排序
        selected.sort(key=lambda x: x.consistency_score, reverse=True)
        return selected[:20]  # 返回前20
    
    def analyze_trading_strategy(self, trader: Trader) -> TradingStrategy:
        """分析交易者的策略"""
        
        roi = trader.pnl / trader.volume if trader.volume > 0 else 0
        
        # 基于 ROI 和交易量推断策略类型
        if roi > 0.2:
            strategy_type = "高频精准型"
            patterns = ["精准择时", "高胜率", "快速进出"]
            risk_level = "中高风险"
            holding = "短期 (< 7天)"
        elif roi > 0.1:
            strategy_type = "趋势跟踪型"
            patterns = ["趋势判断准确", "持有时间较长", "仓位管理优秀"]
            risk_level = "中等风险"
            holding = "中期 (1-4周)"
        elif roi > 0.05:
            strategy_type = "价值投资型"
            patterns = ["深度研究", "长期持有", "稳健收益"]
            risk_level = "中低风险"
            holding = "长期 (> 1个月)"
        else:
            strategy_type = "量化套利型"
            patterns = ["高频交易", "套利为主", "积少成多"]
            risk_level = "低风险"
            holding = "超短期 (< 1天)"
        
        return TradingStrategy(
            trader_address=trader.address,
            strategy_name=strategy_type,
            key_patterns=patterns,
            risk_level=risk_level,
            avg_holding_time=holding,
            preferred_categories=["政治", "加密", "体育"],  # 需要进一步分析
            success_factors=["严格止损", "仓位管理", "情绪控制"]
        )
    
    def generate_report(self) -> Dict[str, Any]:
        """生成完整分析报告"""
        
        print("📊 正在获取全部时间排行榜...")
        all_time = self.get_leaderboard("ALL", 50)
        
        print("📊 正在获取月度排行榜...")
        monthly = self.get_leaderboard("MONTH", 50)
        
        print("🎯 正在筛选目标交易者...")
        targets = self.select_target_traders(all_time, monthly)
        
        print("📈 正在分析交易策略...")
        strategies = []
        for trader in targets[:10]:  # 只分析前10
            strategy = self.analyze_trading_strategy(trader)
            strategies.append(strategy)
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_analyzed": len(all_time),
                "targets_selected": len(targets),
                "highly_recommended": len([t for t in targets if t.recommendation == "强烈推荐"])
            },
            "target_traders": [
                {
                    "rank": t.rank,
                    "address": t.address,
                    "username": t.username,
                    "pnl": round(t.pnl, 2),
                    "volume": round(t.volume, 2),
                    "consistency_score": t.consistency_score,
                    "risk_score": t.risk_score,
                    "recommendation": t.recommendation
                }
                for t in targets
            ],
            "strategies": [
                {
                    "trader": s.trader_address[:20] + "...",
                    "strategy": s.strategy_name,
                    "patterns": s.key_patterns,
                    "risk": s.risk_level,
                    "holding_time": s.avg_holding_time
                }
                for s in strategies
            ]
        }
        
        return report


def main():
    """主函数"""
    print("=" * 60)
    print("🦞 Polymarket 顶级交易者分析系统")
    print("=" * 60)
    
    analyzer = PolymarketAnalyzer()
    report = analyzer.generate_report()
    
    # 保存报告
    filename = f"polymarket_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print("📋 分析报告摘要")
    print("=" * 60)
    print(f"分析总数: {report['summary']['total_analyzed']}")
    print(f"目标选中: {report['summary']['targets_selected']}")
    print(f"强烈推荐: {report['summary']['highly_recommended']}")
    
    print("\n🎯 推荐追踪地址 (前10):")
    print("-" * 60)
    for i, trader in enumerate(report['target_traders'][:10], 1):
        print(f"\n{i}. {trader['username']}")
        print(f"   地址: {trader['address']}")
        print(f"   总盈利: ${trader['pnl']:,.2f}")
        print(f"   稳定性: {trader['consistency_score']}/100")
        print(f"   风险度: {trader['risk_score']}/100")
        print(f"   推荐: {trader['recommendation']}")
    
    print(f"\n💾 完整报告已保存: {filename}")
    print("=" * 60)


if __name__ == "__main__":
    main()
