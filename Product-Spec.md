# Math Adaptive Trainer — 产品需求文档

**版本：** v0.1.0  
**日期：** 2026-04-29  
**状态：** 草稿 / MVP 第一版

---

## 1. 项目概述

Math Adaptive Trainer 是一个面向小学四年级学生的本地数学计算训练 Web App。第一版（v0.1.0）只验证最小训练闭环：出题 → 答题 → 判题 → 记录 → 组间动态调整 → 弱项分析 → 掌握度更新 → 家长日报。

第一版不是完整数学平台。第一版不是 AI 产品。第一版不是游戏化产品。第一版不是云端产品。

## 2. 目标用户

**主要用户：** 小学四年级学生（约 9-10 岁）  
**次要用户：** 家长（查看日报、了解训练情况）

用户特征：
- 已具备 100 以内加减法基础，但熟练度参差不齐
- 在华为 MatePad 平板上使用浏览器访问
- 每天需要完成固定量的计算训练
- 注意力集中时间有限，需要组间休息
- 需要正向反馈维持训练动力

## 3. 核心目标

帮助孩子每天完成 100 道 100 以内加减法训练，并让系统根据答题表现动态调整后续题目比例，让家长清楚知道孩子哪里强、哪里弱、明天应该练什么。

核心指标：
- 每日完成 100 题
- 组间动态调整题型分布
- 生成家长可读懂的日报
- 数据完全本地存储

## 4. MVP 边界

v0.1.0 必须实现：

- 4 个页面：首页、训练页、结果页、家长日报页
- 每日 100 题训练，分 4 组，每组 25 题
- 10 个基础加减法题型（A1-A6、S1-S4）
- 组间动态调整题型比例
- 答题即时判题和轻反馈
- 错题记录和结果页复盘
- 掌握度评分（0-100）
- 家长日报（程序模板生成）
- 本地 IndexedDB 数据持久化

## 5. 非目标功能

v0.1.0 明确不做：

- 真实 AI / Mock AI / aiService / mockAIService
- 后端服务器
- 账号系统 / 登录注册
- 云同步 / 数据上传
- 完整 PWA Service Worker
- 安装到桌面
- 周报 / 30 天训练评估
- SettingsPage / ReviewPage / CompletePage
- 速度冲刺模式
- M1 两步混合题 / M2 凑整策略题
- 乘法 / 除法 / 小数 / 分数
- 徽章系统 / 排行榜 / 成就系统
- 多人档案 / 用户切换
- 复杂游戏化（角色、剧情、关卡）
- 付费功能 / 订阅
- 当场重做错题
- 错题当场长篇讲解
- 符号看错 / 位值错误 / 修改次数等复杂错误分类
- 空答案检测 / 多次尝试分析

## 6. 页面设计规格

### 6.1 HomePage

**路径：** `/#/`

**布局：**
- 顶部：产品标题 "Math Adaptive Trainer"
- 中部："开始今日训练" 大按钮
- 下部：最近一次训练摘要卡片
- 底部角落："重置本地数据" 小按钮（带二次确认）

**最近一次训练摘要显示：**
- 日期
- 完成题数 / 正确题数 / 正确率
- 总用时

**交互：**
- 点击"开始今日训练" → 清空当日临时数据 → 跳转 `/#/training`
- 点击"重置本地数据" → 弹出确认对话框 → 确认后清空所有 IndexedDB 数据

### 6.2 TrainingPage

**路径：** `/#/training`

**布局：**
- 顶部栏：当前组号（如"第 1 组 / 4 组"）、当前题号（如"第 7 题 / 25 题"）
- 中部：大号算式显示区
- 下部：大号数字输入框
- 底部：提交按钮

**训练流程：**
1. 进入页面时生成第 1 组 25 题
2. 显示第 1 题，孩子输入答案并提交
3. 系统判题，显示轻反馈
4. 反馈停留 0.5-2 秒后自动进入下一题
5. 第 25、50、75 题提交后显示休息页
6. 休息页显示时，后台生成下一组 25 题
7. 孩子点击"继续"后进入下一组
8. 完成第 100 题后保存训练记录，跳转结果页

**休息页内容：**
- "休息一下！"
- 已完成进度（如"已完成 25 题"）
- 简短鼓励语
- "继续"按钮

**算式显示规则：**
- 数字和运算符使用大号字体（建议 48-64px）
- 等号后留白给孩子心算
- 答案在输入框中显示

**输入框规则：**
- 只允许输入数字
- 回车键等同于点击提交
- 提交后自动清空，准备下一题

### 6.3 ResultPage

**路径：** `/#/result/:sessionId`

**布局：**
- 顶部：训练完成标题
- 上部统计卡片：总题数、正确题数、正确率、总用时、平均单题用时
- 中部：错题列表
- 底部："查看家长日报"按钮、"返回首页"按钮

**错题列表每项显示：**
- 题号
- 原算式
- 孩子答案
- 正确答案
- 错误类型标签
- 简短讲解（模板）
- 2 道同 skillTag 变式题（仅展示，不要求作答）

### 6.4 ReportPage

**路径：** `/#/report/:sessionId`

**布局：**
- 顶部："今日训练日报"标题
- 日期和训练概况
- 完成情况统计
- 强项题型列表
- 弱项题型列表
- 主要错误类型统计
- 明日训练建议
- 家长关注点
- 底部："返回首页"按钮

## 7. 训练流程

```
[HomePage] 点击"开始今日训练"
    ↓
[TrainingPage `/#/training`] 生成第 1 组 25 题
    ↓
逐题作答（1-25题）
    ↓
[第 25 题完成后] 显示休息页，后台生成第 2 组
    ↓
点击"继续"，进入第 2 组（26-50题）
    ↓
逐题作答
    ↓
[第 50 题完成后] 显示休息页，后台生成第 3 组
    ↓
点击"继续"，进入第 3 组（51-75题）
    ↓
逐题作答
    ↓
[第 75 题完成后] 显示休息页，后台生成第 4 组
    ↓
点击"继续"，进入第 4 组（76-100题）
    ↓
逐题作答
    ↓
[第 100 题完成后] 保存训练记录
    ↓
[ResultPage `/#/result/:sessionId`] 显示结果和错题复盘
    ↓
[ReportPage `/#/report/:sessionId`] 显示家长日报
```

## 8. 题型标签体系

### 8.1 支持的题型（v0.1.0）

| 标签 | 名称 | 示例 |
|------|------|------|
| A1 | 10 以内加减 | 3 + 5 = ? |
| A2 | 整十加减 | 30 + 40 = ? |
| A3 | 两位数加一位数不进位 | 23 + 4 = ? |
| A4 | 两位数加一位数进位 | 28 + 5 = ? |
| A5 | 两位数加两位数不进位 | 32 + 45 = ? |
| A6 | 两位数加两位数进位 | 58 + 37 = ? |
| S1 | 两位数减一位数不退位 | 56 - 3 = ? |
| S2 | 两位数减一位数退位 | 52 - 7 = ? |
| S3 | 两位数减两位数不退位 | 78 - 35 = ? |
| S4 | 两位数减两位数退位 | 63 - 28 = ? |

### 8.2 不支持的题型（v0.1.0 之后版本考虑）

- M1：两步加减混合
- M2：凑整 / 接近整十
- 乘法
- 除法
- 小数
- 分数

### 8.3 各题型目标用时

| 标签 | 目标用时（秒/题） |
|------|------------------|
| A1 | 3 |
| A2 | 3 |
| A3 | 5 |
| A4 | 6 |
| A5 | 6 |
| A6 | 8 |
| S1 | 5 |
| S2 | 6 |
| S3 | 6 |
| S4 | 8 |

## 9. 出题规则

### 9.1 各题型的出题范围

**A1：10 以内加减**
- 两个操作数均为 1-9
- 加法结果不超过 10
- 减法被减数大于减数

**A2：整十加减**
- 两个操作数均为 10-90 的整十数
- 加法结果不超过 100
- 减法被减数大于减数

**A3：两位数加一位数不进位**
- 被加数为 11-89 的两位数
- 加数为 1-9 的一位数
- 个位相加不产生进位（被加数个位 + 加数 < 10）
- 结果不超过 99

**A4：两位数加一位数进位**
- 被加数为 11-89 的两位数
- 加数为 1-9 的一位数
- 个位相加产生进位（被加数个位 + 加数 ≥ 10）
- 结果不超过 99

**A5：两位数加两位数不进位**
- 两个操作数均为 10-89 的两位数
- 个位相加不产生进位
- 十位相加不产生进位
- 结果不超过 99

**A6：两位数加两位数进位**
- 两个操作数均为 10-89 的两位数
- 至少一个位产生进位（个位或十位）
- 结果不超过 100

**S1：两位数减一位数不退位**
- 被减数为 11-99 的两位数
- 减数为 1-9 的一位数
- 个位相减不需要退位（被减数个位 ≥ 减数）

**S2：两位数减一位数退位**
- 被减数为 11-99 的两位数
- 减数为 1-9 的一位数
- 个位相减需要退位（被减数个位 < 减数）

**S3：两位数减两位数不退位**
- 被减数为 20-99 的两位数
- 减数为 10-89 的两位数，且小于被减数
- 个位和十位相减均不需要退位

**S4：两位数减两位数退位**
- 被减数为 20-99 的两位数
- 减数为 10-89 的两位数，且小于被减数
- 至少一个位需要退位

### 9.2 出题随机性

- 每道题的操作数通过随机数生成
- 必须满足该题型的数字约束条件
- 同一组内同一 skillTag 的题目，操作数不能重复
- 生成时过滤结果，确保不生成负数或超过 100 的结果

## 10. 100 题组间动态调整规则

### 10.1 分组结构

每日 100 题分为 4 组，每组 25 题。

### 10.2 第 1 组：基础诊断组

第 1 组在训练开始时生成，覆盖全部 10 个 skillTag。

默认分布：
- A1：3 题
- A2：3 题
- A3：2 题
- A4：2 题
- A5：2 题
- A6：2 题
- S1：2 题
- S2：2 题
- S3：2 题
- S4：3 题

（总计 25 题，可根据需要微调）

### 10.3 第 2 组：初步调整组

完成第 1 组（25 题）后，根据第 1 组表现调整第 2 组题型比例。

调整逻辑：
1. 识别第 1 组中的弱项 skillTag（见第 15 章）
2. 弱项 skillTag 增加题量，最多占本组 60%（15 题）
3. 已掌握 skillTag 至少保留 20%（5 题）
4. 剩余为题量分配给随机复习题（10%-20%，即 3-5 题）

如果弱项不足 60%，剩余题量分配给随机复习。

### 10.4 第 3 组：强化弱项组

完成前 50 题后，根据前 50 题（第 1 组 + 第 2 组）的整体表现调整第 3 组。

调整逻辑：
1. 重新计算所有 skillTag 的正确率和平均用时（基于前 50 题数据）
2. 弱项 skillTag 增加题量，最多占本组 60%
3. 已掌握 skillTag 至少保留 20%
4. 随机复习题 10%-20%

### 10.5 第 4 组：弱项复测和基础巩固组

完成前 75 题后，根据前 75 题表现调整第 4 组。

调整逻辑：
1. 重新计算所有 skillTag 指标
2. 剩余弱项 skillTag 增加题量，最多占本组 60%
3. 已掌握 skillTag 至少保留 20%
4. 随机复习题 10%-20%
5. 若已无明确弱项，则均匀分配各 skillTag

### 10.6 调整约束

1. 不做每题实时调整，只做每 25 题一次组间动态调整
2. 弱项最多占下一组的 60%
3. 已掌握题型至少保留 20%
4. 随机复习题保留 10%-20%
5. 如果 A1 表现不佳，不继续降级，只增加 A1 题量并减少高难题比例
6. 每组必须恰好 25 题

### 10.7 降级保护

- 如果孩子在 A1 上表现不佳（正确率低于 70%），系统不生成比 A1 更简单的题目
-  Instead，增加 A1 题量，减少 A5、A6、S3、S4 等高难度题量
- 降级保护确保孩子不会被推到未学过的知识范围

## 11. 答题反馈规则

### 11.1 即时判题

每道题提交后，系统立即判题：
- 比较孩子输入的答案与正确答案
- 记录判题结果（正确 / 错误）
- 记录单题用时（从题目显示到提交的时间，单位：毫秒）

### 11.2 答对反馈

答对时显示简短正向反馈，例如：
- "答对了！"
- "正确！"
- "很好！"
- "棒！"

反馈停留时间：0.5-1 秒，自动进入下一题。

### 11.3 答错反馈

答错时显示：
- 正确答案（例如"正确答案是 25"）
- 温和提示（例如"这题先记下，最后一起看。"）

示例：
- "正确答案是 25，这题先记下，最后一起看。"
- "答案是 42，不用担心，等下我们一起复习。"

反馈停留时间：1-2 秒，自动进入下一题。

### 11.4 反馈限制

- 答错时不进行长篇讲解
- 答错时不要求孩子当场重做
- 所有错题进入结果页错题复盘区
- 当场反馈停留时间控制在 0.5-2 秒

### 11.5 休息页触发

第 25、50、75 题提交后：
1. 显示休息页覆盖层
2. 休息页显示进度和鼓励语
3. 后台开始生成下一组 25 题
4. 孩子点击"继续"后关闭休息页，显示下一组第 1 题

## 12. 答案校验规则

### 12.1 输入校验

- 输入框只允许输入数字（0-9）
- 不允许输入负号、小数点、空格等字符
- 允许输入前导零（提交时自动去除）
- 最大输入长度限制为 3 位数字（因为 100 以内加减，最大结果为 100）

### 12.2 答案判断

- 将孩子输入的数字与正确答案进行严格相等比较
- 不考虑前导零（"05" 等同于 "5"）
- 不允许多次提交同一题

### 12.3 空答案处理

- 输入框为空时，提交按钮无效
- 不将空答案视为错误

## 13. 答题记录规则

### 13.1 单题记录字段

每道题答题后记录以下信息：

| 字段 | 类型 | 说明 |
|------|------|------|
| questionId | string | 题目唯一标识（组内序号） |
| skillTag | SkillTag | 题型标签 |
| operand1 | number | 第一个操作数 |
| operator | '+' or '-' | 运算符 |
| operand2 | number | 第二个操作数 |
| correctAnswer | number | 正确答案 |
| userAnswer | number | 用户答案 |
| isCorrect | boolean | 是否答对 |
| timeSpent | number | 用时（毫秒） |
| errorType | ErrorType | null | 错误类型（答对时为 null） |

### 13.2 训练会话记录字段

每次训练完成后保存：

| 字段 | 类型 | 说明 |
|------|------|------|
| sessionId | string | 会话唯一标识（时间戳） |
| date | string | 日期（YYYY-MM-DD） |
| totalQuestions | number | 总题数（100） |
| correctCount | number | 正确题数 |
| accuracy | number | 正确率（0-1） |
| totalTime | number | 总用时（毫秒） |
| avgTimePerQuestion | number | 平均单题用时（毫秒） |
| questions | QuestionRecord[] | 每题详细记录 |
| groupResults | GroupResult[] | 每组统计结果 |
| weakTags | SkillTag[] | 当日弱项标签 |
| strongTags | SkillTag[] | 当日强项标签 |

### 13.3 记录时机

- 单题记录：每道题提交后立即记录到内存
- 会话记录：完成 100 题后一次性写入 IndexedDB
- 休息页期间不丢失已答题目数据

## 14. 错误类型规则

v0.1.0 只保留 4 种错误类型：

| 错误类型 | 标识 | 判断条件 |
|----------|------|----------|
| 普通计算错误 | calculation_error | 答错，且不符合进位/退位错误特征 |
| 进位相关错误 | carry_error | 加法题答错，且孩子答案 = 正确答案 - 10 |
| 退位相关错误 | borrow_error | 减法题答错，且孩子答案 = 正确答案 + 10 |
| 用时偏长 | slow_answer | 答对，但用时超过目标用时的 2 倍 |

### 14.1 错误类型判断优先级

1. 先判断是否答错
2. 如果答错，检查是否符合 carry_error 或 borrow_error 特征
3. 如果不符合，标记为 calculation_error
4. 如果答对但用时过长，额外标记 slow_answer（一道题可以同时有 calculation_error 和 slow_answer）

### 14.2 不实现的错误分类

v0.1.0 不实现：
- 符号看错
- 位值错误
- 修改次数统计
- 空答案分析
- 多次尝试分析
- 输入过程分析

## 15. 弱项和强项判断规则

### 15.1 弱项判断

某个 skillTag 满足以下任一条件，即可视为当前弱项：

1. **正确率低于 70%**：该 skillTag 已答题中正确率 < 0.7
2. **平均用时超过目标用时的 1.5 倍**：该 skillTag 已答题平均用时 > targetTime × 1.5
3. **同一 skillTag 连续错误 2 次以上**：在最近答题中出现同一 skillTag 连续答错 ≥ 2 次

判断时机：
- 第 1 组完成后（判断第 2 组调整依据）
- 第 2 组完成后（判断第 3 组调整依据，基于第 1+2 组数据）
- 第 3 组完成后（判断第 4 组调整依据，基于第 1+2+3 组数据）
- 训练完成后（用于日报）

### 15.2 强项判断

某个 skillTag 满足以下所有条件，可视为强项：

1. **正确率不低于 85%**：该 skillTag 已答题中正确率 ≥ 0.85
2. **平均用时不超过目标用时的 1.2 倍**：该 skillTag 已答题平均用时 ≤ targetTime × 1.2
3. **当日样本数不少于 3 题**：该 skillTag 在当日已出现 ≥ 3 次

判断时机：训练完成后（用于日报）。

### 15.3 注意

- 一个 skillTag 可能同时不是弱项也不是强项（处于中间状态）
- 判断基于截至当前已完成的答题数据
- 样本量过少（< 3 题）时不做强项判断

## 16. 掌握度更新规则

### 16.1 掌握度定义

每个 skillTag 都有一个 masteryScore，范围为 0-100。

初始值：所有 skillTag 的 masteryScore 初始为 0。

### 16.2 更新时机

训练完成后（100 题全部答完），一次性更新所有 skillTag 的掌握度。

### 16.3 更新公式

```
新掌握度 = 旧掌握度 × 0.8 + 今日表现分 × 0.2
```

即：新掌握度是旧掌握度的 80% 加上今日表现分的 20%。

### 16.4 今日表现分计算

今日表现分由两个指标组成：
- 正确率分，占 70%
- 速度分，占 30%

```
今日表现分 = 正确率 × 70 + 速度得分 × 30
```

**正确率分：**
- 正确率 × 100（例如正确率 0.8 → 80 分）

**速度得分：**
- 平均用时 ≤ 目标用时：100 分
- 平均用时 > 目标用时：max(0, 100 - (平均用时 - 目标用时) / 目标用时 × 100)

示例：
- 目标用时 5 秒，平均用时 4 秒 → 速度得分 100
- 目标用时 5 秒，平均用时 7 秒 → 速度得分 100 - (7-5)/5 × 100 = 60
- 目标用时 5 秒，平均用时 12 秒 → 速度得分 max(0, 100 - 7/5 × 100) = 0

### 16.5 不更新规则

如果某个 skillTag 当天没有出现（即当日 100 题中没有该类型的题目），则该 skillTag 的掌握度不更新。

## 17. 错题变式规则

### 17.1 变式题用途

- 只在结果页展示错题变式
- 变式题不进入当日 100 题统计
- 变式题第一版只用于复盘展示，不要求孩子提交答案

### 17.2 变式题生成规则

每道错题生成 2 道同 skillTag 的变式题：

1. 变式题必须使用与原题相同的 skillTag
2. 变式题必须由程序规则生成（按第 9 章出题规则）
3. 变式题不能和原题完全相同（至少一个操作数不同）
4. 2 道变式题之间也不能完全相同

### 17.3 变式题展示

在结果页错题列表中，每道错题下方显示：
- "类似练习："
- 变式题 1：算式（不显示答案）
- 变式题 2：算式（不显示答案）

家长或孩子可以口头练习这两道题。

## 18. 家长日报规则

### 18.1 日报生成方式

家长日报由程序模板生成，不使用 AI。

### 18.2 日报必须包含的内容

1. **今日完成题数**：100
2. **正确题数**：答对题数
3. **正确率**：正确题数 / 100
4. **总用时**：格式化显示（如"15 分 32 秒"）
5. **平均单题用时**：总用时 / 100
6. **强项题型**：根据第 15 章规则判断的强项 skillTag 列表
7. **弱项题型**：根据第 15 章规则判断的弱项 skillTag 列表
8. **主要错误类型**：统计当日各错误类型出现次数，取前 3
9. **明日训练建议**：根据弱项生成的模板建议
10. **家长关注点**：模板提示，建议家长注意的方面

### 18.3 日报模板示例

见附录：家长日报模板。

### 18.4 日报展示形式

- 在 ReportPage 中分段展示
- 使用清晰的标题和列表
- 统计数字使用醒目字体
- 弱项使用警示颜色（如橙色）
- 强项使用正向颜色（如绿色）

## 19. 本地存储设计

### 19.1 存储方案

- 使用浏览器 IndexedDB 持久化数据
- 使用 Dexie.js 简化 IndexedDB 操作
- 所有数据存储在本地，不上传服务器

### 19.2 存储内容

1. **训练会话记录**：每次 100 题训练完成后的完整记录
2. **掌握度数据**：每个 skillTag 的当前 masteryScore
3. **应用状态**：最近一次训练的 sessionId 等轻量状态

### 19.3 数据生命周期

- 训练会话记录：长期保存，用于历史查看
- 掌握度数据：长期保存，用于动态调整
- 应用状态：可重置

### 19.4 重置功能

HomePage 提供"重置本地数据"按钮：
- 点击后弹出确认对话框
- 确认后清空所有 IndexedDB 数据
- 掌握度恢复初始值（全部为 0）
- 历史训练记录清空

### 19.5 存储限制处理

- IndexedDB 存储空间通常足够（每次训练记录约 10-50KB）
- 如遇存储空间不足，提示用户并重置数据
- v0.1.0 不实现自动清理历史记录

### 19.6 数据存储边界

**GitHub Pages 不保存任何训练数据：**
- GitHub Pages 仅托管前端静态资源（HTML、CSS、JS）
- 所有训练数据、掌握度、历史记录均不上传到 GitHub
- 训练数据与代码仓库完全隔离

**IndexedDB 数据只存在访问设备的浏览器中：**
- 训练数据保存在 MatePad 浏览器本地的 IndexedDB 中
- 数据属于设备级别，不随账号迁移

**换设备访问时不会自动同步历史记录：**
- 在 MatePad 上完成的训练记录，换到其他设备访问同一 URL 时不会显示
- 每台设备拥有独立的数据存储
- 第一版不做跨设备同步

**清除浏览器数据会导致训练记录丢失：**
- 清除 MatePad 浏览器缓存/数据时，IndexedDB 数据一并清除
- 建议家长不要清除浏览器数据，或在清除前知会孩子
- 第一版不做云端备份

**第一版不做：**
- 云端备份和云同步
- 数据导出/导入
- 跨设备数据迁移

## 20. TypeScript 数据结构

见附录：TypeScript Interface。

## 21. UI 体验规范

### 21.1 设备适配

- 主要适配华为 MatePad 浏览器
- 横屏优先（平板横屏使用）
- 最小宽度支持 768px（平板竖屏也可使用）
- 不强制锁定屏幕方向

### 21.2 字体和字号

- 算式显示：48-64px，粗体
- 输入框：36-48px
- 标题：24-32px
- 正文：16-18px
- 按钮文字：18-24px

### 21.3 颜色规范

- 正确答案反馈：绿色系（如 #4CAF50）
- 错误答案反馈：橙色系（如 #FF9800），不用红色避免打击
- 弱项标识：橙色系
- 强项标识：绿色系
- 主按钮：蓝色系（如 #2196F3）
- 背景：浅色系（如 #F5F5F5 或白色）

### 21.4 触摸友好

- 按钮最小触摸区域 48×48px
- 输入框高度至少 56px
- 按钮间间距至少 16px
- 避免需要精确点击的小元素

### 21.5 动画和过渡

- 题与题之间过渡：简单淡入或滑动，时长 200-300ms
- 反馈显示/消失：淡入淡出，时长 150-200ms
- 休息页弹出：从底部滑入或淡入
- 避免复杂动画，保持简洁

### 21.6 输入体验

- 数字输入框自动获取焦点
- 支持物理键盘和虚拟键盘
- 回车键提交答案
- 提交后自动清空并聚焦

## 22. 非功能性需求

### 22.1 性能

- 页面首屏加载时间 < 3 秒（在 MatePad 上）
- 题目生成时间 < 100ms（每组 25 题）
- 题与题切换延迟 < 500ms（含反馈停留）
- IndexedDB 读写操作 < 100ms

### 22.2 可靠性

- 训练过程中页面刷新不丢失已答题目（使用 sessionStorage 或临时 IndexedDB 存储）
- 意外关闭后，当天训练不自动恢复（v0.1.0 不实现断点续练）
- 数据损坏时提示用户重置

### 22.3 可访问性（基础）

- 文字和背景对比度符合 WCAG AA 标准
- 所有交互元素支持键盘操作
- 图片和图标有文字替代（如有）

### 22.4 离线使用

- v0.1.0 为本地运行，默认离线可用
- 不实现完整 PWA Service Worker
- 不实现安装到桌面

### 22.5 网络依赖

- 页面静态资源（HTML/CSS/JS）从 GitHub Pages 加载，首次访问需要网络
- 静态资源加载完成后，训练过程完全离线运行，不依赖网络请求
- 除静态资源加载外，训练过程不产生任何网络请求
- 不依赖后端 API

### 22.6 IndexedDB 初始化

- 应用启动时检测 IndexedDB 可用性
- 如 IndexedDB 初始化失败，显示友好提示："存储功能不可用，请检查浏览器设置或使用现代浏览器"
- 训练开始前确保 IndexedDB 已就绪

## 23. 技术栈建议

| 技术 | 选择 | 说明 |
|------|------|------|
| 框架 | React 18+ | 组件化开发 |
| 构建工具 | Vite | 快速开发和构建 |
| 语言 | TypeScript | 类型安全 |
| 路由 | React Router v6 | 页面路由 |
| 状态管理 | React Context + useState | 第一版状态简单，不需要 Redux |
| 本地存储 | Dexie.js | 封装 IndexedDB |
| 样式 | 普通 CSS / CSS Modules | 不使用 Tailwind / Styled Components |
| 构建输出 | 静态文件 | 本地打开或简单服务器 |

### 23.1 不使用以下技术

- 后端（Node.js / Python / Go 等）
- 账号系统（OAuth / JWT / Session）
- 云同步（Firebase / Supabase / 自建 API）
- AI（OpenAI / Claude / 本地模型）
- Mock AI（模拟 AI 响应的服务）
- 状态管理库（Redux / Zustand / MobX）
- UI 组件库（Ant Design / Material UI）
- CSS 框架（Tailwind CSS / Bootstrap）
- 完整 PWA Service Worker

### 23.2 部署方式

**代码托管：**
- 源代码存放在 GitHub 仓库中
- 使用 Git 进行版本管理

**静态托管：**
- 构建产物通过 GitHub Pages 发布为静态网站
- GitHub Pages 只负责托管前端静态资源
- 孩子的训练数据不上传到 GitHub

**访问方式：**
- 华为 MatePad 通过浏览器访问 GitHub Pages URL
- 首次访问加载静态资源后，训练过程完全在本地运行

### 23.3 路由方案

由于项目部署在 GitHub Pages 上，前端路由需要避免刷新 404。

**第一版使用 HashRouter，路径形式：**
- 首页：`/#/`
- 训练页：`/#/training`
- 结果页：`/#/result/:sessionId`
- 日报页：`/#/report/:sessionId`

**不使用 BrowserRouter：**
- BrowserRouter 在 GitHub Pages 上刷新会导致 404
- 处理 GitHub Pages fallback 会增加不必要的复杂度
- 第一版保持简单，使用 HashRouter

### 23.4 Vite 配置要求

**基础配置：**

如果 GitHub Pages 地址形如 `https://用户名.github.io/math-adaptive-trainer/`，则 `vite.config.ts` 中需要配置：

```typescript
export default defineConfig({
  base: '/math-adaptive-trainer/',
  // ...
});
```

如果部署到自定义域名根路径，则 `base` 可以使用 `base: "/"`。

**第一版默认按 GitHub Pages 仓库路径部署处理，使用 `base: '/math-adaptive-trainer/'`。**

### 23.5 GitHub Pages 部署流程

**手动部署：**
1. `npm install` — 安装依赖
2. `npm run build` — 构建生产版本
3. 将 `dist` 目录内容发布到 GitHub Pages
4. MatePad 浏览器访问 GitHub Pages URL

**自动部署（推荐）：**
使用 GitHub Actions 工作流，在推送至 main 分支时自动构建并部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 24. 风险与缓解措施

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 孩子在 MatePad 浏览器上输入体验差 | 高 | 大号输入框，支持物理键盘，充分测试虚拟键盘 |
| 100 题对孩子来说太长，中途放弃 | 高 | 分 4 组，组间休息，每题反馈轻量 |
| IndexedDB 在某些浏览器上不可用 | 中 | 检测支持性，不支持时提示使用现代浏览器 |
| 动态调整算法效果不佳 | 中 | 先实现基础规则，后续根据实际数据调参 |
| 横屏布局在竖屏下显示异常 | 中 | 添加基础响应式，确保竖屏可用 |
| 数据积累后 IndexedDB 性能下降 | 低 | v0.1.0 数据量小，暂不处理 |

## 25. 开发里程碑

### 里程碑 1：项目搭建（1 天）
- 初始化 Vite + React + TypeScript 项目
- 配置路由（4 个页面骨架）
- 配置 Dexie.js 和 IndexedDB 表结构
- 实现基础页面跳转

### 里程碑 2：核心训练流程（2-3 天）
- 实现出题引擎（10 个 skillTag）
- 实现 TrainingPage 逐题作答
- 实现即时判题和反馈
- 实现休息页和组间切换
- 实现 100 题完成后的数据保存

### 里程碑 3：动态调整和掌握度（2 天）
- 实现弱项/强项判断算法
- 实现组间动态调整题型比例
- 实现掌握度更新计算
- 集成到训练流程中

### 里程碑 4：结果和日报（1-2 天）
- 实现 ResultPage（统计、错题列表）
- 实现错题变式生成
- 实现 ReportPage（家长日报模板）
- 实现错题讲解模板

### 里程碑 5：首页和收尾（1 天）
- 实现 HomePage（开始训练、最近摘要、重置）
- UI 细节打磨
- MatePad 横屏测试
- Bug 修复

预计总工期：7-9 天

## 26. 第一版验收标准

### 26.1 功能验收

- [ ] 首页可以正常显示，点击"开始今日训练"进入训练页
- [ ] 训练页可以完成 100 题作答，分 4 组，每组 25 题
- [ ] 第 25、50、75 题后显示休息页
- [ ] 每道题提交后立即判题
- [ ] 答对显示简短正向反馈
- [ ] 答错显示正确答案和温和提示
- [ ] 第 2、3、4 组的题型比例根据前几组表现动态调整
- [ ] 完成 100 题后自动保存记录并跳转到结果页
- [ ] 结果页显示正确的统计数字
- [ ] 结果页显示错题列表和变式题
- [ ] 家长日报页显示完整的日报内容
- [ ] 首页显示最近一次训练摘要
- [ ] 重置本地数据功能正常工作

### 26.2 数据验收

- [ ] 训练记录正确保存到 IndexedDB
- [ ] 掌握度在训练完成后正确更新
- [ ] 刷新页面后历史记录不丢失
- [ ] 重置后数据清空

### 26.3 体验验收

- [ ] MatePad 横屏下页面布局正常
- [ ] 算式和输入框字号足够大
- [ ] 按钮触摸区域足够大
- [ ] 反馈停留时间不冗长
- [ ] 过渡动画流畅不卡顿

### 26.4 边界验收

- [ ] 输入非数字内容被阻止
- [ ] 空答案不能提交
- [ ] 所有 10 个 skillTag 都能正常出题
- [ ] 题与题之间操作数不重复

---

# 附录

## A. TypeScript Interface

```typescript
// 题型标签
enum SkillTag {
  A1 = 'A1', // 10 以内加减
  A2 = 'A2', // 整十加减
  A3 = 'A3', // 两位数加一位数不进位
  A4 = 'A4', // 两位数加一位数进位
  A5 = 'A5', // 两位数加两位数不进位
  A6 = 'A6', // 两位数加两位数进位
  S1 = 'S1', // 两位数减一位数不退位
  S2 = 'S2', // 两位数减一位数退位
  S3 = 'S3', // 两位数减两位数不退位
  S4 = 'S4', // 两位数减两位数退位
}

// 错误类型
enum ErrorType {
  CALCULATION_ERROR = 'calculation_error',
  CARRY_ERROR = 'carry_error',
  BORROW_ERROR = 'borrow_error',
  SLOW_ANSWER = 'slow_answer',
}

// 运算符
type Operator = '+' | '-';

// 题目定义
interface Question {
  id: string;
  skillTag: SkillTag;
  operand1: number;
  operator: Operator;
  operand2: number;
  correctAnswer: number;
}

// 答题记录
interface QuestionRecord {
  questionId: string;
  skillTag: SkillTag;
  operand1: number;
  operator: Operator;
  operand2: number;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // 毫秒
  errorType: ErrorType | null;
}

// 单组统计
interface GroupResult {
  groupNumber: number; // 1-4
  questions: QuestionRecord[];
  correctCount: number;
  totalTime: number;
}

// 训练会话
interface TrainingSession {
  sessionId: string;
  date: string; // YYYY-MM-DD
  totalQuestions: number;
  correctCount: number;
  accuracy: number; // 0-1
  totalTime: number; // 毫秒
  avgTimePerQuestion: number; // 毫秒
  questions: QuestionRecord[];
  groupResults: GroupResult[];
  weakTags: SkillTag[];
  strongTags: SkillTag[];
}

// 掌握度记录
interface MasteryRecord {
  skillTag: SkillTag;
  score: number; // 0-100
  lastUpdated: string; // YYYY-MM-DD
}

// 应用状态
interface AppState {
  lastSessionId: string | null;
  lastSessionDate: string | null;
}

// 题目生成配置
interface QuestionConfig {
  skillTag: SkillTag;
  count: number;
}

// 变式题
interface VariantQuestion {
  originalQuestionId: string;
  skillTag: SkillTag;
  operand1: number;
  operator: Operator;
  operand2: number;
  correctAnswer: number;
}

// 日报数据
interface DailyReport {
  sessionId: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalTime: number;
  avgTimePerQuestion: number;
  strongTags: SkillTag[];
  weakTags: SkillTag[];
  errorTypeStats: { type: ErrorType; count: number }[];
  tomorrowSuggestion: string;
  parentFocus: string;
}
```

## B. IndexedDB / Dexie.js 表结构建议

```typescript
import Dexie, { Table } from 'dexie';

class MathTrainerDB extends Dexie {
  sessions!: Table<TrainingSession, string>;
  mastery!: Table<MasteryRecord, SkillTag>;
  appState!: Table<AppState, number>;

  constructor() {
    super('MathTrainerDB');
    this.version(1).stores({
      sessions: 'sessionId, date',
      mastery: 'skillTag',
      appState: '++id',
    });
  }
}

export const db = new MathTrainerDB();
```

### 表说明

| 表名 | 主键 | 索引 | 说明 |
|------|------|------|------|
| sessions | sessionId | date | 训练会话记录 |
| mastery | skillTag | - | 各题型掌握度 |
| appState | id（自增） | - | 应用状态（单条记录） |

## C. 出题算法伪代码

```
function generateQuestions(configs: QuestionConfig[]): Question[] {
  questions = []

  for each config in configs {
    count = 0
    attempts = 0
    maxAttempts = config.count * 10

    while count < config.count and attempts < maxAttempts {
      attempts++
      question = generateSingleQuestion(config.skillTag)

      if question is valid and not duplicate(questions, question) {
        questions.push(question)
        count++
      }
    }
  }

  shuffle(questions) // 打乱顺序
  return questions
}

function generateSingleQuestion(skillTag: SkillTag): Question {
  switch skillTag {
    case A1:
      if random() > 0.5 {
        // 加法
        a = random(1, 9)
        b = random(1, 10 - a)
        return { operand1: a, operator: '+', operand2: b, correctAnswer: a + b }
      } else {
        // 减法
        a = random(2, 10)
        b = random(1, a - 1)
        return { operand1: a, operator: '-', operand2: b, correctAnswer: a - b }
      }

    case A2:
      if random() > 0.5 {
        a = random(1, 9) * 10
        b = random(1, (100 - a) / 10) * 10
        return { operand1: a, operator: '+', operand2: b, correctAnswer: a + b }
      } else {
        a = random(2, 9) * 10
        b = random(1, (a / 10) - 1) * 10
        return { operand1: a, operator: '-', operand2: b, correctAnswer: a - b }
      }

    case A3:
      a = random(11, 89)
      b = random(1, 9 - (a % 10))
      return { operand1: a, operator: '+', operand2: b, correctAnswer: a + b }

    case A4:
      a = random(11, 89)
      maxB = 9
      minB = 10 - (a % 10)
      if minB > maxB { a = adjustToValidRange(a) }
      b = random(minB, maxB)
      return { operand1: a, operator: '+', operand2: b, correctAnswer: a + b }

    case A5:
      a = random(10, 89)
      b = random(10, 99 - a)
      // 确保不进位
      if (a % 10) + (b % 10) >= 10 { adjust to valid }
      if Math.floor(a / 10) + Math.floor(b / 10) >= 10 { adjust to valid }
      return { operand1: a, operator: '+', operand2: b, correctAnswer: a + b }

    case A6:
      a = random(10, 89)
      b = random(10, 100 - a)
      // 确保至少一个进位
      if (a % 10) + (b % 10) < 10 and Math.floor(a/10) + Math.floor(b/10) < 10 {
        adjust to valid
      }
      return { operand1: a, operator: '+', operand2: b, correctAnswer: a + b }

    case S1:
      a = random(11, 99)
      b = random(1, a % 10)
      return { operand1: a, operator: '-', operand2: b, correctAnswer: a - b }

    case S2:
      a = random(11, 99)
      b = random((a % 10) + 1, 9)
      return { operand1: a, operator: '-', operand2: b, correctAnswer: a - b }

    case S3:
      a = random(20, 99)
      b = random(10, a - 1)
      // 确保不退位
      if (a % 10) < (b % 10) or Math.floor(a/10) < Math.floor(b/10) { adjust }
      return { operand1: a, operator: '-', operand2: b, correctAnswer: a - b }

    case S4:
      a = random(20, 99)
      b = random(10, a - 1)
      // 确保至少一个退位
      if (a % 10) >= (b % 10) and Math.floor(a/10) >= Math.floor(b/10) { adjust }
      return { operand1: a, operator: '-', operand2: b, correctAnswer: a - b }
  }
}

function notDuplicate(questions, newQuestion): boolean {
  for each q in questions {
    if q.skillTag == newQuestion.skillTag and
       q.operand1 == newQuestion.operand1 and
       q.operand2 == newQuestion.operand2 {
      return false
    }
  }
  return true
}
```

## D. 动态生成下一组题目的伪代码

```
function generateNextGroup(
  completedRecords: QuestionRecord[],
  groupNumber: number // 2, 3, or 4
): QuestionConfig[] {

  // 统计各 skillTag 的表现
  stats = calculateStats(completedRecords)

  // 判断弱项和已掌握
  weakTags = []
  masteredTags = []
  otherTags = []

  for each tag in ALL_TAGS {
    records = filter(completedRecords, r => r.skillTag == tag)

    if isWeak(records, tag) {
      weakTags.push(tag)
    } else if isMastered(records, tag) {
      masteredTags.push(tag)
    } else {
      otherTags.push(tag)
    }
  }

  configs = []
  remaining = 25

  // 1. 弱项题：最多 60%（15 题）
  weakQuota = Math.min(15, weakTags.length * 3) // 每个弱项最多 3 题
  if weakQuota > 0 {
    weakPerTag = distributeEvenly(weakQuota, weakTags.length)
    for each tag in weakTags {
      count = Math.min(weakPerTag, 3)
      configs.push({ skillTag: tag, count })
      remaining -= count
    }
  }

  // 2. 已掌握题：至少 20%（5 题）
  masteredQuota = Math.max(5, Math.floor(remaining * 0.2))
  if masteredTags.length > 0 {
    masteredPerTag = distributeEvenly(masteredQuota, masteredTags.length)
    for each tag in masteredTags {
      count = Math.max(1, masteredPerTag)
      configs.push({ skillTag: tag, count })
      remaining -= count
    }
  } else if remaining > 0 {
    // 如果没有已掌握标签，从 otherTags 中取
    fallbackCount = Math.max(5, Math.floor(remaining * 0.2))
    // 分配给 otherTags
  }

  // 3. 随机复习题：10%-20%
  reviewQuota = Math.min(remaining, randomInt(3, 5))
  if remaining > 0 {
    allAvailableTags = ALL_TAGS.filter(t => not in configs or can add more)
    for i = 0 to reviewQuota - 1 {
      tag = randomFrom(allAvailableTags)
      addOrIncrement(configs, tag, 1)
      remaining--
    }
  }

  // 4. 剩余题量分配给 otherTags 或随机
  if remaining > 0 {
    distributeEvenlyToTags(remaining, otherTags, configs)
  }

  // 确保总数为 25
  total = sum(configs.map(c => c.count))
  if total < 25 {
    // 补足到 25
    addRandomQuestions(25 - total, configs)
  } else if total > 25 {
    // 从非弱项中削减
    reduceFromNonWeak(total - 25, configs)
  }

  return configs
}

function isWeak(records, tag): boolean {
  if records.length == 0 return false

  correctRate = correctCount / records.length
  if correctRate < 0.7 return true

  avgTime = sum(timeSpent) / records.length
  if avgTime > TARGET_TIME[tag] * 1.5 return true

  // 检查连续错误
  consecutiveErrors = checkConsecutiveErrors(records, tag)
  if consecutiveErrors >= 2 return true

  return false
}

function isMastered(records, tag): boolean {
  if records.length < 3 return false

  correctRate = correctCount / records.length
  if correctRate < 0.85 return false

  avgTime = sum(timeSpent) / records.length
  if avgTime > TARGET_TIME[tag] * 1.2 return false

  return true
}

function distributeEvenly(total, parts): number {
  return Math.floor(total / parts)
}
```

## E. 掌握度更新伪代码

```
function updateMastery(
  currentMastery: MasteryRecord[],
  sessionRecords: QuestionRecord[]
): MasteryRecord[] {

  // 按 skillTag 分组统计
  tagStats = groupBy(sessionRecords, r => r.skillTag)

  updatedMastery = []

  for each masteryRecord in currentMastery {
    tag = masteryRecord.skillTag
    stats = tagStats[tag]

    if not stats or stats.records.length == 0 {
      // 该 skillTag 今天没有出现，不更新
      updatedMastery.push(masteryRecord)
      continue
    }

    oldScore = masteryRecord.score

    // 计算今日表现分
    correctRate = stats.correctCount / stats.records.length
    accuracyScore = correctRate * 100

    targetTime = TARGET_TIME[tag]
    avgTime = sum(stats.records.map(r => r.timeSpent)) / stats.records.length / 1000 // 转为秒

    if avgTime <= targetTime {
      speedScore = 100
    } else {
      speedScore = max(0, 100 - ((avgTime - targetTime) / targetTime) * 100)
    }

    todayScore = accuracyScore * 0.7 + speedScore * 0.3

    // 更新掌握度
    newScore = oldScore * 0.8 + todayScore * 0.2
    newScore = Math.min(100, Math.max(0, Math.round(newScore)))

    updatedMastery.push({
      skillTag: tag,
      score: newScore,
      lastUpdated: today
    })
  }

  return updatedMastery
}
```

## F. 家长日报模板

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 今日训练日报
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
日期：{date}

【今日完成情况】
✓ 完成题数：{totalQuestions} 题
✓ 正确题数：{correctCount} 题
✓ 正确率：{accuracy}%
✓ 总用时：{totalTimeFormatted}
✓ 平均单题用时：{avgTimeFormatted}

【强项题型】
{strongTagsList}
（孩子对这些题型掌握较好，可以保持练习）

【弱项题型】
{weakTagsList}
（建议重点加强这些题型的练习）

【主要错误类型】
{errorTypeStats}

【明日训练建议】
{tomorrowSuggestion}

【家长关注点】
{parentFocus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 明日建议模板

根据弱项生成：

- 弱项包含 A1："10 以内加减法需要加强，建议每天额外练习 10-20 道基础题。"
- 弱项包含 A3/A4："两位数加一位数需要练习，建议关注进位规则。"
- 弱项包含 S2/S4："退位减法需要加强，建议复习借位方法。"
- 弱项包含 A5/A6："两位数加法需要更多练习，建议分步计算。"
- 多个弱项："建议明天重点练习 {weakTagNames}，每次练习 10 题即可。"
- 无弱项："今天表现很好！建议明天保持正常训练量，适当加入新题型。"

### 家长关注点模板

- 正确率 < 60%："今天正确率偏低，建议关注孩子是否理解题目，可适当降低难度。"
- 平均用时 > 10 秒/题："答题速度偏慢，建议加强基础练习，提高熟练度。"
- 有 carry_error："进位计算出错较多，建议复习进位规则。"
- 有 borrow_error："退位计算出错较多，建议复习借位方法。"
- 表现良好："今天整体表现不错，继续保持！"

## G. 错题讲解模板

### A1（10 以内加减）

```
这是基础的 10 以内{operator}法。
{operand1} {operator} {operand2} = {correctAnswer}
```

### A2（整十加减）

```
整十数相{operator}，先算十位，再补零。
{operand1} {operator} {operand2} = {correctAnswer}
```

### A3（两位数加一位数不进位）

```
个位和个位相加，十位不变。
{operand1} + {operand2}：个位 {operand1%10} + {operand2} = {operand1%10 + operand2}，十位是 {Math.floor(operand1/10)}，所以等于 {correctAnswer}。
```

### A4（两位数加一位数进位）

```
个位相加满 10 要向十位进 1。
{operand1} + {operand2}：个位 {operand1%10} + {operand2} = {operand1%10 + operand2}，满 10 进 1，十位 {Math.floor(operand1/10)} + 1 = {Math.floor(correctAnswer/10)}，所以等于 {correctAnswer}。
```

### A5（两位数加两位数不进位）

```
个位加个位，十位加十位，都不进位。
{operand1} + {operand2} = {correctAnswer}
```

### A6（两位数加两位数进位）

```
注意进位！个位或十位相加满 10 要进 1。
{operand1} + {operand2} = {correctAnswer}
```

### S1（两位数减一位数不退位）

```
个位够减，直接减，十位不变。
{operand1} - {operand2}：个位 {operand1%10} - {operand2} = {operand1%10 - operand2}，所以等于 {correctAnswer}。
```

### S2（两位数减一位数退位）

```
个位不够减，要从十位借 1 当 10。
{operand1} - {operand2}：个位 {operand1%10} 不够减 {operand2}，借 1 后变成 {operand1%10 + 10} - {operand2} = {operand1%10 + 10 - operand2}，十位变成 {Math.floor(operand1/10) - 1}，所以等于 {correctAnswer}。
```

### S3（两位数减两位数不退位）

```
个位和个位减，十位和十位减，都不退位。
{operand1} - {operand2} = {correctAnswer}
```

### S4（两位数减两位数退位）

```
注意退位！个位不够减要从十位借 1。
{operand1} - {operand2} = {correctAnswer}
```

## H. 儿童反馈语模板

### 答对反馈（随机选择）

```
答对了！
正确！
很好！
棒！
不错！
太棒了！
```

### 答错反馈（随机选择）

```
正确答案是 {correctAnswer}，这题先记下，最后一起看。
答案是 {correctAnswer}，不用担心，等下我们一起复习。
正确答案是 {correctAnswer}，最后有专门的错题时间。
答案是 {correctAnswer}，记好这一题，最后再看。
```

### 休息页鼓励语（随机选择）

```
休息一下！
做得很好，休息一会儿！
已经完成 {completed} 题了，继续加油！
休息一下，准备下一组！
{completed} 题完成，休息一下再出发！
```

## I. 第一版不做功能清单

| 功能 | 原因 | 计划版本 |
|------|------|----------|
| 真实 AI | MVP 聚焦规则引擎 | v1.0+ |
| Mock AI / aiService | 不做 AI 相关任何实现 | - |
| 后端服务器 | 纯本地运行 | - |
| 账号系统 | 无多用户需求 | v1.0+ |
| 云同步 | 纯本地运行 | v1.0+ |
| 完整 PWA Service Worker | MVP 简化 | v0.2+ |
| 安装到桌面 | 非核心功能 | v0.2+ |
| 周报 | 先验证日报 | v0.3+ |
| 30 天训练评估 | 数据积累后再做 | v0.5+ |
| SettingsPage | 无复杂设置 | v0.3+ |
| ReviewPage（独立复习页） | 结果页已含复盘 | v0.3+ |
| CompletePage | 结果页足够 | - |
| 速度冲刺模式 | 先做基础训练 | v0.3+ |
| M1 两步混合题 | 超出四年级基础 | v0.3+ |
| M2 凑整策略题 | 策略性题目延后 | v0.4+ |
| 乘法 | 超出当前范围 | v0.5+ |
| 除法 | 超出当前范围 | v0.5+ |
| 小数 | 超出当前范围 | v0.6+ |
| 分数 | 超出当前范围 | v0.6+ |
| 徽章系统 | 先做核心功能 | v0.4+ |
| 排行榜 | 无多人场景 | - |
| 多人档案 | 无多用户需求 | v1.0+ |
| 复杂游戏化 | 非产品方向 | - |
| 付费功能 | 先做免费核心 | v1.0+ |
| 当场重做错题 | 策略是集中复盘 | v0.2+ |
| 错题当场长篇讲解 | 轻反馈策略 | v0.2+ |
| 符号看错检测 | 简化错误分类 | v0.3+ |
| 位值错误检测 | 简化错误分类 | v0.3+ |
| 修改次数统计 | 输入过程分析延后 | v0.4+ |
| 空答案分析 | 空答案不允许提交 | - |
| 多次尝试分析 | 一题一次提交 | - |
