#!/usr/bin/env python3
"""
Polymarket 自动追踪与 Telegram 通知系统 - 修复版
使用真正活跃的交易者地址
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
TELEGRAM_CHAT_ID = "8185893461"

# 真正活跃的目标地址（高ROI + 近期活跃）
TARGET_ADDRESSES = [
    {
        "address": "0xc2e7800b5af46e6093872b177b7a5e7f0563be51",
        "name": "beachboy4",
        "strategy": "高频精准型",
        "total_pnl": 3829987,
        "month_pnl": 3652163,
        "month_roi": 155.8
    },
    {
        "address": "0x2005d16a84ceefa912d4e380cd32e7ff827875ea",
        "name": "RN1",
        "strategy": "量化套利型",
        "total_pnl": 6802572,
        "month_pnl": 1543598,
        "month_roi": 14.0
    },
    {
        "address": "0xee613b3fc183ee44f9da9c05f53e2da107e3debf",
        "name": "sovereign2013",
        "strategy": "趋势跟踪型",
        "total_pnl": 3353884,
        "month_pnl": 1649803,
        "month_roi": 13.0
    },
    {
        "address": "0x204f72f35326db932158cba6adff0b9a1da95e14",
        "name": "swisstony",
        "strategy": "价值投资型",
        "total_pnl": 5699512,
        "month_pnl": 1050771,
        "month_roi": 16.6
    },
    {
        "address": "0x507e52ef684ca2dd91f90a9d26d149dd3288beae",
        "name": "GamblingIsAllYouNeed",
        "strategy": "量化套利型",
        "total_pnl": 4659546,
        "month_pnl": 843314,
        "month_roi": 13.2
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


class PolymarketMonitor:
    """Polymarket 监控器"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.api_base = "https://data-api.polymarket.com"
        self.notifier = TelegramNotifier(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
    
    def get_trader_activity(self, address: str, name: str) -> List[Dict]:
        """获取交易者最近活动"""
        url = f"{self.api_base}/activity"
        params = {
            "user": address,
            "limit": 50,
            "type": "TRADE"
        }
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            if response.status_code != 200:
                print(f"  {name} API 错误: {response.status_code}")
                return []
            
            data = response.json()
            activities = []
            
            # 只取最近4小时的活动
            cutoff = datetime.now() - timedelta(hours=4)
            
            for item in data:
                ts = item.get('timestamp')
                if ts:
                    try:
                        activity_time = datetime.fromtimestamp(ts)
                        if activity_time > cutoff:
                            activities.append({
                                'trader': name,
                                'trader_address': address,
                                'side': item.get('side'),
                                'market': item.get('title', 'Unknown'),
                                'market_slug': item.get('slug', ''),
                                'event_slug': item.get('eventSlug', ''),
                                'outcome': item.get('outcome', ''),
                                'amount': float(item.get('usdcSize', 0)),
                                'size': float(item.get('size', 0)),
                                'price': float(item.get('price', 0)),
                                'time': activity_time.strftime('%H:%M'),
                                'condition_id': item.get('conditionId', '')
                            })
                    except Exception as e:
                        pass
            
            return activities
        except Exception as e:
            print(f"获取 {name} 活动失败: {e}")
            return []
    
    def analyze_signals(self, all_activities: List[Dict]) -> List[Dict]:
        """分析交易信号 - 寻找共识"""
        market_trades = defaultdict(list)
        
        for act in all_activities:
            if act['side'] == 'BUY' and act['condition_id']:
                key = (act['event_slug'], act['outcome'])
                market_trades[key].append(act)
        
        signals = []
        
        for (event_slug, outcome), trades in market_trades.items():
            if len(trades) >= 2:
                unique_traders = set(t['trader'] for t in trades)
                if len(unique_traders) >= 2:
                    total_amount = sum(t['amount'] for t in trades)
                    signals.append({
                        'event': event_slug,
                        'market': trades[0]['market'],
                        'outcome': outcome,
                        'traders': list(unique_traders),
                        'trade_count': len(trades),
                        'total_amount': round(total_amount, 2),
                        'avg_price': round(sum(t['price'] for t in trades) / len(trades), 3),
                        'url': f"https://polymarket.com/event/{event_slug}"
                    })
        
        signals.sort(key=lambda x: x['total_amount'], reverse=True)
        return signals
    
    def generate_trader_summary(self, all_activities: List[Dict]) -> str:
        """生成交易者摘要"""
        summary = {}
        for act in all_activities:
            name = act['trader']
            if name not in summary:
                summary[name] = {'count': 0, 'amount': 0}
            summary[name]['count'] += 1
            summary[name]['amount'] += act['amount']
        
        lines = []
        for name, data in sorted(summary.items(), key=lambda x: x[1]['amount'], reverse=True):
            trader_info = next((t for t in TARGET_ADDRESSES if t['name'] == name), None)
            if trader_info:
                lines.append(f"• {name}: {data['count']}笔, ${data['amount']:.0f} | 月ROI {trader_info['month_roi']:.1f}%")
        
        return '\n'.join(lines) if lines else "暂无交易活动"
    
    def run(self):
        """执行监控"""
        print(f"🦞 Polymarket 监控启动 - {datetime.now()}")
        
        all_activities = []
        for target in TARGET_ADDRESSES:
            print(f"  扫描 {target['name']}...")
            activities = self.get_trader_activity(target['address'], target['name'])
            all_activities.extend(activities)
            if activities:
                print(f"    找到 {len(activities)} 笔近期交易")
            time.sleep(0.5)
        
        print(f"  总计: {len(all_activities)} 笔交易")
        
        signals = self.analyze_signals(all_activities)
        print(f"  发现 {len(signals)} 个共识信号")
        
        trader_summary = self.generate_trader_summary(all_activities)
        
        if signals:
            signal_text = ""
            for i, sig in enumerate(signals[:5], 1):
                signal_text += f"""
{i}. <b>{sig['market'][:50]}</b>
   结果: {sig['outcome']}
   交易者: {', '.join(sig['traders'])}
   金额: ${sig['total_amount']} ({sig['trade_count']}笔)
   均价: {sig['avg_price']}
   🔗 <a href='{sig['url']}'>查看事件</a>
"""
            
            message = f"""
🚨 <b>Polymarket 交易信号</b>
⏰ {datetime.now().strftime('%Y-%m-%d %H:%M')} UTC

📊 <b>发现 {len(signals)} 个共识交易</b>
{signal_text}

👤 <b>交易者活动</b>
{trader_summary}

⚠️ <b>风险提示</b>
• 过往业绩不代表未来
• 建议小额测试
• 设置止损 -15%
"""
        else:
            message = f"""
🦞 <b>Polymarket 监控报告</b>
⏰ {datetime.now().strftime('%Y-%m-%d %H:%M')} UTC

📊 <b>扫描结果</b>
• 监控地址: 5 个顶级交易者
• 近期交易: {len(all_activities)} 笔
• 共识信号: 0 个

👤 <b>交易者活动</b>
{trader_summary}

💡 <b>状态</b>
暂无明确跟单机会，继续监控中...

<i>下次扫描: 4小时后</i>
"""
        
        success = self.notifier.send_message(message)
        if success:
            print("  ✅ Telegram 通知已发送")
        else:
            print("  ❌ Telegram 通知发送失败")
        
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'activities': len(all_activities),
            'signals': len(signals),
            'notification_sent': success
        }
        
        with open('monitor_log.jsonl', 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        print(f"  💾 日志已保存")


def main():
    monitor = PolymarketMonitor()
    monitor.run()


if __name__ == "__main__":
    main()
