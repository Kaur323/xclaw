# XClaw DApp

XClaw Web3 投资平台前端实现

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **图标**: Lucide React
- **状态管理**: React Hooks

## 项目结构

```
xclaw-dapp/
├── src/
│   ├── components/       # 公共组件
│   │   ├── Header.tsx   # 顶部导航
│   │   ├── TabBar.tsx   # 底部标签栏
│   │   └── WalletModal.tsx  # 钱包连接弹窗
│   ├── pages/           # 页面组件
│   │   ├── PurchasePage.tsx    # 先锋配售
│   │   ├── PredictionPage.tsx  # 预测市场
│   │   ├── OpenClawPage.tsx    # AI 助手
│   │   ├── CommunityPage.tsx   # 社区
│   │   └── RewardsPage.tsx     # 奖励
│   ├── types/           # TypeScript 类型定义
│   ├── data/            # 模拟数据
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── public/              # 静态资源
├── index.html           # HTML 模板
├── tailwind.config.js   # Tailwind 配置
├── postcss.config.js    # PostCSS 配置
└── package.json         # 项目依赖
```

## 功能模块

### 1. 先锋配售 (Purchase)
- 配售认购（0.2-5 BNB）
- 多轮释放进度展示
- 交易量考核提醒
- 认购历史记录

### 2. 预测市场 (Prediction)
- Polymarket 热门事件展示
- 智能委托（1000U/份）
- 我的委托管理
- 收益统计

### 3. OpenClaw AI
- AI 助手激活（10 USDT）
- 智能对话界面
- 市场分析、趋势预测
- 快捷操作按钮

### 4. 社区 (Community)
- 团队数据统计
- 直推列表
- 龙虾节点等级体系
  - V1: 龙虾组长 (5 BNB)
  - V2: 龙虾队长 (30 BNB)
  - V3: 龙虾大使 (50 BNB)
  - V4: 龙虾领袖 (100 BNB)
- 邀请链接分享

### 5. 奖励 (Rewards)
- 待领取奖励
- 奖励历史记录
- 交易记录
- 一键领取功能

## 设计规范

### 颜色系统
- 主色: `#FF6B6B` (红色渐变)
- 次色: `#4ECDC4` (青色)
- 背景: `#0A0E17` (深色)
- 卡片: `#1A1F2E` (深色浅)
- 边框: `#2A3142` (深色更浅)

### 字体
- Inter (Google Fonts)

### 布局
- 移动端优先设计
- 最大宽度: 448px (max-w-md)
- 底部安全区域适配

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署

构建后的文件位于 `dist/` 目录，可直接部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- 等

## 注意事项

1. 当前使用模拟数据，需要对接真实 API
2. 钱包连接为模拟实现，需要接入真实 Web3 钱包
3. 所有交易操作均为前端演示，未接入智能合约

## 后续开发建议

1. 接入 wagmi/viem 实现真实钱包连接
2. 对接后端 API 替换模拟数据
3. 接入 BSC 主网/测试网智能合约
4. 添加多语言支持 (i18n)
5. 添加 PWA 支持
6. 优化性能和加载速度
