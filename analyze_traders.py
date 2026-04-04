#!/usr/bin/env python3
"""
Polymarket 顶级交易者筛选 - 真正活跃且高 ROI 的地址
"""

import requests
import json
from datetime import datetime

API_BASE = "https://data-api.polymarket.com"

def get_leaderboard(time_period):
    """获取排行榜"""
    url = f"{API_BASE}/v1/leaderboard"
    params = {
        "category": "OVERALL",
        "timePeriod": time_period,
        "orderBy": "PNL",
        "limit": 50
    }
    
    try:
        resp = requests.get(url, params=params, timeout=30)
        return resp.json()
    except:
        return []

def analyze_traders():
    """分析并筛选交易者"""
    
    print("=" * 80)
    print("🦞 Polymarket 交易者重新筛选")
    print("=" * 80)
    
    # 获取数据
    all_time = get_leaderboard("ALL")
    monthly = get_leaderboard("MONTH")
    
    # 创建月度字典
    monthly_dict = {t['proxyWallet']: t for t in monthly}
    
    candidates = []
    
    print("\n📊 分析全部时间前30名...")
    print("-" * 80)
    
    for trader in all_time[:30]:
        addr = trader['proxyWallet']
        name = trader['userName']
        total_pnl = float(trader['pnl'])
        total_vol = float(trader.get('vol', 0))
        
        # 计算总 ROI
        total_roi = (total_pnl / total_vol * 100) if total_vol > 0 else 0
        
        # 获取月度数据
        monthly_data = monthly_dict.get(addr)
        
        if monthly_data:
            month_pnl = float(monthly_data['pnl'])
            month_vol = float(monthly_data.get('vol', 0))
            month_roi = (month_pnl / month_vol * 100) if month_vol > 0 else 0
        else:
            month_pnl = 0
            month_vol = 0
            month_roi = 0
        
        # 筛选条件：
        # 1. 总盈利 > $2M
        # 2. 月度交易量 > $1M (证明活跃)
        # 3. 月度 ROI > 5% 或总 ROI > 20%
        
        is_active = month_vol >= 1000000
        is_profitable = total_pnl >= 2000000
        good_roi = month_roi >= 5 or total_roi >= 20
        
        if is_profitable and is_active and good_roi:
            candidates.append({
                'name': name[:20],
                'address': addr,
                'total_pnl': total_pnl,
                'total_vol': total_vol,
                'total_roi': total_roi,
                'month_pnl': month_pnl,
                'month_vol': month_vol,
                'month_roi': month_roi,
                'score': month_pnl * month_roi / 100  # 综合评分
            })
    
    # 按综合评分排序
    candidates.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"\n✅ 筛选出 {len(candidates)} 个优质地址：")
    print("=" * 80)
    print(f"{'排名':<4} {'用户名':<18} {'总盈利':<10} {'月盈利':<10} {'月交易量':<10} {'月ROI':<8} {'总ROI':<8}")
    print("-" * 80)
    
    for i, c in enumerate(candidates[:10], 1):
        print(f"{i:<4} {c['name']:<18} ${c['total_pnl']/1e6:>6.2f}M   ${c['month_pnl']/1e6:>6.2f}M   ${c['month_vol']/1e6:>6.1f}M   {c['month_roi']:>6.1f}%   {c['total_roi']:>6.1f}%")
    
    print("\n" + "=" * 80)
    print("🎯 推荐监控地址（前5）：")
    print("=" * 80)
    
    for i, c in enumerate(candidates[:5], 1):
        print(f"\n{i}. {c['name']}")
        print(f"   地址: {c['address']}")
        print(f"   总盈利: ${c['total_pnl']:,.0f} | 月盈利: ${c['month_pnl']:,.0f}")
        print(f"   月交易量: ${c['month_vol']:,.0f} | 月ROI: {c['month_roi']:.1f}%")
    
    # 保存配置
    config = {
        'generated_at': datetime.now().isoformat(),
        'targets': [
            {
                'name': c['name'],
                'address': c['address'],
                'total_pnl': c['total_pnl'],
                'month_pnl': c['month_pnl'],
                'month_vol': c['month_vol'],
                'month_roi': c['month_roi']
            }
            for c in candidates[:5]
        ]
    }
    
    with open('trader_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"\n💾 配置已保存到 trader_config.json")
    print("=" * 80)

if __name__ == "__main__":
    analyze_traders()
