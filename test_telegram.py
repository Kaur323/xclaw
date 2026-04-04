import requests

TOKEN = '8516202745:AAHcaLhbprHBws8TUBzMwSm3s1yKaCdVoQI'
CHAT_ID = '8185893461'

url = f'https://api.telegram.org/bot{TOKEN}/sendMessage'

message = """🦞 <b>Polymarket 监控测试</b>

⏰ 时间: 2026-04-04 02:07 UTC

📊 <b>监控状态</b>
• 监控地址: 5 个顶级交易者
• 扫描频率: 每 4 小时
• 状态: ✅ 运行正常

📈 <b>目标地址</b>
• reachingthesky: $3.74M | 趋势跟踪
• majorexploiter: $3.67M | 价值投资
• kch123: $11.5M | 量化套利
• beachboy4: $4.04M | 趋势跟踪
• 432614799197: $4.53M | 量化套利

💡 <b>说明</b>
最近 4 小时内目标地址暂无交易活动。
有交易时会立即通知你！

<i>下次扫描: 06:07</i>"""

payload = {
    'chat_id': CHAT_ID,
    'text': message,
    'parse_mode': 'HTML'
}

try:
    resp = requests.post(url, json=payload, timeout=30)
    print(f'Status: {resp.status_code}')
    print(f'OK: {resp.json().get("ok")}')
    if resp.status_code == 200:
        print('✅ 消息发送成功！')
    else:
        print(f'❌ 失败: {resp.text}')
except Exception as e:
    print(f'❌ 错误: {e}')
