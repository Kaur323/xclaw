#!/usr/bin/env python3
"""
Polymarket 自动追踪与 Telegram 通知系统
每4小时自动扫描，发送跟单建议到 Telegram
"""

import json
import requests
import time
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from collections import defaultdict

# Telegram 配置
TELEGRAM_BOT_TOKEN = "8516202745:AAHcaLhbprHBws8TUBzMwSm3s1yKaCdVoQI"
TELEGRAM_CHAT_ID = "8185893461"  # 你的 Chat ID

# 目标追踪地址
TARGET_ADDRESSES = [
    {
        "address": "0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee",
        "name": "kch123",
        "strategy": "量化套利型",
        "weight": 1.0,
        "total_pnl": 11525073
    },
    {
        "address": "0xefbc5fec8d7b0acdc8911bdd9a98d6964308f9a2",
        "name": "reachingthesky",
        "strategy": "趋势跟踪型",
        "weight": 1.2,
        "total_pnl": 3742635
    },
    {
        "address": "0x019782cab5d844f02bafb71f512758be78579f3c",
        "name": "majorexploiter",
        "strategy": "价值投资型",
        "weight": 1.2,
        "total_pnl": 3668541
    },
    {
        "address": "0xc2e7800b5af46e6093872b177b7a5e7f0563be51",
        "name": "beachboy4",
        "strategy": "趋势跟踪型",
        "weight": 1.0,
        "total_pnl": 4040442
    },
    {
        "address": "0xdc876e6873772d38716fda7f2452a78d426d7ab6",
        "name": "432614799197",
        "strategy": "量化套利型",
        "weight": 1.0,
        "total_pnl": 4526176
    }
]

class TelegramNotifier:
    """Telegram 通知器"""
    
    def __init__(self, token: str, chat_id: str):
        self.token = token
        self.chat_id = chat_id
        self.base_url = f"https://api.telegram.org/bot{token}"
    
    def send_message(self, message: str, parse_mode: str = "HTML") -> bool:
        """发送消息到 Telegram"""
        url = f"{self.base_url}/sendMessage"
        payload = {
            "chat_id": self.chat_id,
            "text": message,
            "parse_mode": parse_mode,
            "disable_web_page_preview": False
        }
        
        try:
            response = requests.post(url, json=payload, timeout=30)
            return response.status_code == 200
        except Exception as e:
            print(f"发送 Telegram 消息失败: {e}")
            return False
    
    def send_signal_alert(self, signals: List[Dict], analysis: str):
        """发送交易信号警报"""
        if not signals:
            message = f"""
🦞 <b>Polymarket 监控报告</b>
⏰ 时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}

📊 <b>扫描结果</b>
• 监控地址: 5 个
• 新信号: 0 个
• 状态: 持续监控中

💡 <b>建议</b>
暂无明确跟单机会，继续监控...

📈 <b>目标地址状态</b>
{analysis}

<i>下次扫描: 4小时后</i>
"""
        else:
            signal_text = ""
            for i, sig in enumerate(signals[:3], 1):
                signal_text += f"""
{i}. <b>{sig['market'][:40]}...</b>
   方向: {'🟢 看多' if sig['direction'] == 'YES' else '🔴 看空'}
   置信度: {sig['confidence']}%
   支持: {', '.join(sig['supporting'])}
   仓位: {sig['allocation']}
   🔗 <a href='{sig['url']}'>查看事件</a>
"""
            
            message = f"""
🚨 <b>Polymarket 跟单信号</b>
⏰ 时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}

📊 <b>发现 {len(signals)} 个交易机会</b>
{signal_text}

📈 <b>地址分析</b>
{analysis}

⚠️ <b>风险提示</b>
• 过往业绩不代表未来
• 建议小额测试
• 设置止损 -15%

<i>自动扫描每4小时执行</i>
"""
        
        return self.send_message(message)


class PolymarketMonitor:
    """Polymarket 监控器"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.api_base = "https://data-api.polymarket.com/v1"
        self.notifier = TelegramNotifier(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
    
    def get_trader_activity(self, address: str, name: str) -> List[Dict]:
        """获取交易者最近活动"""
        url = f"{self.api_base}/activity/{address}"
        
        try:
            response = self.session.get(url, params={"limit": 20}, timeout=30)
            if response.status_code != 200:
                return []
            
            data = response.json()
            activities = []
            
            # 只取最近4小时的活动
            cutoff = datetime.now() - timedelta(hours=4)
            
            for item in data.get('activities', []):
                ts = item.get('timestamp', '')
                if ts:
                    try:
                        activity_time = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                        if activity_time > cutoff:
                            activities.append({
                                'trader': name,
                                'action': item.get('action'),
                                'market': item.get('marketTitle'),
                                'market_id': item.get('marketId'),
                                'outcome': item.get('outcome'),
                                'amount': float(item.get('amount', 0)),
                                'price': float(item.get('price', 0)),
                                'time': ts
                            })
                    except:
                        pass
            
            return activities
        except Exception as e:
            print(f"获取 {name} 活动失败: {e}")
            return []
    
    def analyze_signals(self, all_activities: List[Dict]) -> List[Dict]:
        """分析交易信号"""
        # 按市场分组
        market_votes = defaultdict(lambda: {'YES': [], 'NO': []})
        
        for act in all_activities:
            if act['action'] == 'BUY' and act['market_id']:
                market_votes[act['market_id']]['outcome'] = act['outcome']
                market_votes[act['market_id']]['traders'].append(act['trader'])
                market_votes[act['market_id']]['market'] = act['market']
        
        signals = []
        
        for market_id, data in market_votes.items():
            yes_count = len(data.get('YES', []))
            no_count = len(data.get('NO', []))
            total = yes_count + no_count
            
            if total >= 2:  # 至少2个地址参与
                if yes_count >= 2 and yes_count > no_count:
                    confidence = (yes_count / total) * 100
                    signals.append({
                        'market': data.get('market', market_id),
                        'market_id': market_id,
                        'direction': 'YES',
                        'confidence': round(confidence, 1),
                        'supporting': data.get('YES', []),
                        'opposing': data.get('NO', []),
                        'allocation': '20-25%' if confidence >= 75 else '10-15%',
                        'url': f'https://polymarket.com/event/{market_id}'
                    })
                elif no_count >= 2 and no_count > yes_count:
                    confidence = (no_count / total) * 100
                    signals.append({
                        'market': data.get('market', market_id),
                        'market_id': market_id,
                        'direction': 'NO',
                        'confidence': round(confidence, 1),
                        'supporting': data.get('NO', []),
                        'opposing': data.get('YES', []),
                        'allocation': '20-25%' if confidence >= 75 else '10-15%',
                        'url': f'https://polymarket.com/event/{market_id}'
                    })
        
        # 按置信度排序
        signals.sort(key=lambda x: x['confidence'], reverse=True)
        return signals
    
    def generate_analysis(self) -> str:
        """生成地址分析报告"""
        analysis = []
        for trader in TARGET_ADDRESSES:
            analysis.append(
                f"• {trader['name']}: ${trader['total_pnl']:,} | {trader['strategy']}"
            )
        return '\n'.join(analysis)
    
    def run(self):
        """执行监控"""
        print(f"🦞 Polymarket 监控启动 - {datetime.now()}")
        
        # 收集所有活动
        all_activities = []
        for target in TARGET_ADDRESSES:
            print(f"  扫描 {target['name']}...")
            activities = self.get_trader_activity(target['address'], target['name'])
            all_activities.extend(activities)
            time.sleep(0.5)
        
        print(f"  获取到 {len(all_activities)} 条近期活动")
        
        # 分析信号
        signals = self.analyze_signals(all_activities)
        print(f"  发现 {len(signals)} 个信号")
        
        # 生成分析
        analysis = self.generate_analysis()
        
        # 发送通知
        success = self.notifier.send_signal_alert(signals, analysis)
        if success:
            print("  ✅ Telegram 通知已发送")
        else:
            print("  ❌ Telegram 通知发送失败")
        
        # 保存日志
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'activities': len(all_activities),
            'signals': len(signals),
            'notification_sent': success
        }
        
        with open('monitor_log.jsonl', 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        print(f"  💾 日志已保存")
        print(f"  ⏰ 下次扫描: {(datetime.now() + timedelta(hours=4)).strftime('%H:%M')}")


def main():
    """主函数"""
    monitor = PolymarketMonitor()
    monitor.run()


if __name__ == "__main__":
    main()
