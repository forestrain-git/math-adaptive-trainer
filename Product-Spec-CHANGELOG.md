# Product Spec 变更记录

## v0.1.0 — 2026-04-29

### 初始 PRD 创建

- 创建初始产品需求文档 Product-Spec.md
- 定义 Math Adaptive Trainer v0.1.0 完整产品规格

### 第一版定位

- 明确第一版为纯规则版 MVP
- 验证最小训练闭环：出题 → 答题 → 判题 → 记录 → 组间动态调整 → 弱项分析 → 掌握度更新 → 家长日报

### 明确不做 AI

- 不做真实 AI
- 不做 Mock AI
- 不做 aiService / mockAIService
- 家长日报由程序模板生成
- 错题讲解由程序模板生成
- 所有反馈语由程序模板生成

### 明确不做后端、账号、云同步

- 不做后端服务器
- 不做账号系统 / 登录注册
- 不做云同步 / 数据上传
- 所有数据保存在浏览器本地 IndexedDB

### 明确部署方式

- 部署目标为 GitHub Pages
- 源代码存放在 GitHub 仓库
- 构建产物通过 GitHub Pages 发布为静态网站
- MatePad 通过浏览器访问 GitHub Pages URL

### 数据存储边界

- GitHub Pages 只托管前端静态资源，不保存任何训练数据
- IndexedDB 数据只存在访问设备的浏览器中
- 换设备访问时不会自动同步历史记录
- 清除浏览器数据会导致训练记录丢失
- 第一版不做云端备份和云同步

### 路由方案

- 使用 HashRouter 避免 GitHub Pages 刷新 404
- 路径形式：`/#/`、`/#/training`、`/#/result/:sessionId`、`/#/report/:sessionId`
- 不使用 BrowserRouter，不处理 GitHub Pages fallback

### Vite 配置

- 默认按 GitHub Pages 仓库路径部署
- vite.config.ts 中配置 `base: '/math-adaptive-trainer/'`

### 训练结构

- 明确每日 100 题分为 4 组，每 25 题动态调整
- 第 1 组为基础诊断组
- 第 2 组为初步调整组
- 第 3 组为强化弱项组
- 第 4 组为弱项复测和基础巩固组

### 反馈策略

- 当场轻反馈（0.5-2 秒停留）
- 答错不要求当场重做
- 答错不显示长篇讲解
- 最后集中复盘（结果页错题列表 + 变式题）

### 题型范围

- 明确第一版只支持 10 个基础加减法题型（A1-A6、S1-S4）
- 明确不做 M1（两步混合题）
- 明确不做 M2（凑整策略题）
- 明确不做速度冲刺
- 明确不做乘法、除法、小数、分数

### 不做功能

- 不做周报
- 不做 30 天训练评估
- 不做 SettingsPage
- 不做 ReviewPage
- 不做 CompletePage
- 不做徽章系统
- 不做排行榜
- 不做多人档案
- 不做复杂游戏化
- 不做付费功能
- 不做完整 PWA Service Worker
- 不做安装到桌面
