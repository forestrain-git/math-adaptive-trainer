# Math Adaptive Trainer — MVP 构建指令

**版本：** MVP v0.1.0  
**日期：** 2026-04-29

---

## 一、部署与访问方式

本项目第一版需要托管在 GitHub 仓库中，并通过 GitHub Pages 静态部署。

实际使用方式：

- 开发代码存放在 GitHub 仓库中
- 仓库名称为 math-adaptive-trainer
- 构建产物部署到 GitHub Pages
- 华为 MatePad 通过浏览器访问 GitHub Pages URL
- 示例访问地址形如：
  https://用户名.github.io/math-adaptive-trainer/
- GitHub Pages 只负责托管 HTML、CSS、JavaScript 等静态资源
- 孩子的训练数据不上传到 GitHub
- 所有训练数据保存在 MatePad 浏览器本地 IndexedDB 中
- 换设备访问同一 URL，不会自动同步历史记录
- 清除 MatePad 浏览器数据会导致本地训练记录丢失
- 第一版不做后端、不做账号、不做云同步

---

## 二、技术栈

请使用：

- React
- Vite
- TypeScript
- Dexie.js / IndexedDB
- React Router
- 普通 CSS
- GitHub Pages

不要使用：

- 后端
- 账号系统
- 云同步
- AI
- Mock AI
- 完整 PWA Service Worker
- 大型 UI 框架

localStorage 只允许用于极少量轻配置。主要训练数据必须保存在 IndexedDB 中。

---

## 三、GitHub Pages 技术要求

### 3.1 Vite base 配置

项目仓库名为：math-adaptive-trainer

GitHub Pages 访问路径预计为：https://用户名.github.io/math-adaptive-trainer/

因此 vite.config.ts 中必须配置：base: "/math-adaptive-trainer/"

不要省略 base。不要使用错误的根路径 base: "/" 作为默认配置。

### 3.2 路由方式

为了避免 GitHub Pages 刷新页面 404，第一版必须使用 HashRouter，而不是 BrowserRouter。

路由形式：
- /#/
- /#/training
- /#/result/:sessionId
- /#/report/:sessionId

不要使用 BrowserRouter。不要依赖服务器 fallback。不要要求额外配置 404.html fallback。

### 3.3 package.json 脚本

package.json 中请提供：dev、build、preview、predeploy、deploy

如果使用 gh-pages 包部署 dist，请加入 gh-pages 开发依赖，并配置：
"predeploy": "npm run build"
"deploy": "gh-pages -d dist"

### 3.4 数据存储边界

训练数据必须保存在当前访问设备的浏览器 IndexedDB 中。

不要把训练数据保存到 GitHub。不要调用任何后端 API。不要实现远程数据库。不要实现云同步。不要实现登录。

### 3.5 页面内说明

请在首页或家长日报页用简短文案说明：
"训练数据保存在当前浏览器本地。换设备或清除浏览器数据后，历史记录不会自动保留。"

---

## 四、第一版只实现 4 个页面

### 4.1 HomePage

路径：/#/

功能：
- 显示产品标题
- 显示"开始今日训练"按钮
- 显示最近一次训练摘要
- 提供"重置本地数据"按钮
- 显示本地数据说明："训练数据保存在当前浏览器本地，不会上传到 GitHub。"
- 点击开始后进入 /#/training

### 4.2 TrainingPage

路径：/#/training

功能：
- 每日训练共 100 题
- 100 题分为 4 组，每组 25 题
- 进入页面时只生成第 1 组 25 题
- 第 25、50、75 题后显示休息页
- 休息页期间根据已完成记录动态生成下一组 25 题
- 显示当前题号、当前组号、算式
- 显示大号数字输入框
- 支持按 Enter 提交答案
- 提交答案后自动判题
- 记录单题用时
- 答对后显示简短正向反馈
- 答错后显示正确答案和温和提示
- 答错后不要求当场重做、不显示长篇讲解
- 完成 100 题后保存训练记录、更新掌握度并跳转结果页

### 4.3 ResultPage

路径：/#/result/:sessionId

功能：
- 显示总题数、正确题数、正确率、总用时、平均单题用时
- 显示错题列表（每道错题显示孩子答案、正确答案、错误类型）
- 每道错题显示简短模板讲解
- 每道错题显示 2 道同 skillTag 的变式题
- 提供进入家长日报按钮和返回首页按钮

### 4.4 ReportPage

路径：/#/report/:sessionId

功能：
- 显示家长日报
- 显示今日完成情况
- 显示强项题型、弱项题型、主要错误类型
- 显示明日训练建议
- 显示各题型掌握度变化
- 显示本地数据说明："当前报告来自本设备浏览器 IndexedDB。换设备不会自动同步。"

---

## 五、第一版只支持以下 10 个题型

- A1：10 以内加减
- A2：整十加减
- A3：两位数加一位数不进位
- A4：两位数加一位数进位
- A5：两位数加两位数不进位
- A6：两位数加两位数进位
- S1：两位数减一位数不退位
- S2：两位数减一位数退位
- S3：两位数减两位数不退位
- S4：两位数减两位数退位

不要实现：M1 两步加减混合、M2 凑整 / 接近整十、乘法、除法、小数、分数、速度冲刺

---

## 六、第一版明确不要实现

不要实现以下任何内容：AI、Mock AI、aiService、mockAIService、PWA Service Worker、后端、API 服务、账号系统、登录、云同步、远程数据库、排行榜、徽章系统、多人档案、周报、30 天评估、SettingsPage、ReviewPage、CompletePage、当场重做错题、错题当场长篇讲解、付费功能、复杂动画、大型 UI 框架

请不要额外创建：aiService.ts、mockAIService.ts、backend 目录、server 目录、api 目录、auth 相关文件、cloud sync 相关文件、PWA service worker 文件

---

## 七、请实现以下核心文件

根目录：
- package.json
- vite.config.ts
- tsconfig.json
- index.html

src：
- src/main.tsx
- src/App.tsx
- src/types/index.ts
- src/db/index.ts
- src/data/skillTags.ts
- src/services/questionEngine.ts
- src/services/answerService.ts
- src/services/adaptiveEngine.ts
- src/services/variantService.ts
- src/services/reportService.ts
- src/pages/HomePage.tsx
- src/pages/TrainingPage.tsx
- src/pages/ResultPage.tsx
- src/pages/ReportPage.tsx
- src/styles/global.css

---

## 八、数据结构要求

数据结构至少包括：SkillTagId、SkillTagConfig、MathQuestion、AnswerRecord、DailySession、SkillMastery、ErrorType、SkillPerformance、ParentDailyReport

### MathQuestion 字段
- id、expression、answer、skillTag、difficulty

### AnswerRecord 字段
- id、sessionId、questionId、expression、skillTag、correctAnswer、userAnswer、isCorrect、timeSpentSeconds、errorType、answeredAt

### DailySession 字段
- id、date、totalQuestions、correctCount、accuracy、totalTimeSeconds、averageTimeSeconds、weakSkillTags、strongSkillTags、createdAt

### SkillMastery 字段
- skillTag、masteryScore、updatedAt

### IndexedDB 表
- dailySessions、answerRecords、skillMasteries

---

## 九、src/db/index.ts 要求

请在 src/db/index.ts 中实现：

- 初始化数据库
- 初始化默认掌握度
- 保存 DailySession
- 保存 AnswerRecord 批量记录
- 根据 sessionId 读取 AnswerRecord
- 根据 sessionId 读取 DailySession
- 读取最近一次 DailySession
- 读取所有 SkillMastery
- 更新 SkillMastery
- 重置本地数据

具体函数：
- initializeDatabase()
- initializeDefaultSkillMasteries()
- saveDailySession(session)
- saveAnswerRecords(records)
- getAnswerRecordsBySessionId(sessionId)
- getDailySessionById(sessionId)
- getLatestDailySession()
- getAllSkillMasteries()
- updateSkillMasteries(masteries)
- resetAllLocalData()

要求：
- 使用 Dexie.js
- 所有函数返回 Promise
- 默认初始化 A1-A6、S1-S4 的 SkillMastery
- 默认 masteryScore 可设为 60
- resetAllLocalData 清空所有本地表并重新初始化默认掌握度
- IndexedDB 初始化失败时给出清晰错误
- 不调用后端 API

---

## 十、src/data/skillTags.ts 要求

请在 src/data/skillTags.ts 中实现 10 个题型标签配置。

每个标签包含：id、name、category、difficulty、targetAverageTimeSeconds、description

题型包括：A1、A2、A3、A4、A5、A6、S1、S2、S3、S4

---

## 十一、src/services/questionEngine.ts 要求

### 11.1 generateQuestionBySkillTag(skillTag)

- 根据指定 skillTag 生成一道题
- 所有题目答案必须由程序计算
- 减法不能出现负数
- 结果必须在 0-100 范围内
- 表达式必须清晰，例如 "52 - 27"

### 11.2 generateQuestionsBySkillTag(skillTag, count)

- 批量生成题目
- 尽量避免重复题目
- 不生成超出题型范围的题目

### 11.3 generateInitialTrainingBlock()

- 生成第 1 组 25 题
- 用于基础诊断
- 覆盖 A1-A6、S1-S4

### 11.4 generateNextTrainingBlock(answeredRecords, skillMasteries, blockIndex)

- 根据已完成答题记录生成下一组 25 题
- blockIndex 为 2、3、4
- 根据正确率、平均用时、连续错误情况调整题型比例

### 11.5 analyzeCurrentWeakSkills(answeredRecords)

统计当前已完成题目中的弱项题型。

判断标准：
- 正确率低于 70%
- 或平均用时超过目标用时的 1.5 倍
- 或同一 skillTag 连续错误 2 次以上

### 11.6 buildSkillDistributionForNextBlock(weakSkills, strongSkills, blockIndex)

- 输出下一组 25 题的 skillTag 分布
- 弱项最多占下一组的 60%
- 已掌握题型至少保留 20%
- 随机复习题保留 10%-20%
- 如果 A1 表现不佳，不继续降级，只增加 A1 题量并减少高难题比例

---

## 十二、src/services/answerService.ts 要求

请在 src/services/answerService.ts 中实现：

- checkAnswer(question, userAnswer)
- calculateAnswerTime(startTime, endTime)
- detectBasicErrorType(question, userAnswer, timeSpentSeconds)

错误类型第一版只保留：calculation_error、carry_error、borrow_error、slow_answer
detectBasicErrorType 的基本规则：
- 如果用时超过该 skillTag 目标时间的 1.5 倍，可标记 slow_answer
- 如果 skillTag 是 A4 或 A6，且答错，可优先标记 carry_error
- 如果 skillTag 是 S2 或 S4，且答错，可优先标记 borrow_error
- 其他答错标记 calculation_error
- 如果答对，一般不应标记错误类型

---

## 十三、src/services/adaptiveEngine.ts 要求

请在 src/services/adaptiveEngine.ts 中实现：

- calculateSkillPerformance(records)
- getWeakSkillTags(records)
- getStrongSkillTags(records)
- updateSkillMasteries(oldMasteries, records)
- generateTomorrowSuggestion(records, masteries)

弱项判断规则：某个 skillTag 满足以下任一条件，即可视为当前弱项：
- 正确率低于 70%
- 平均用时超过目标用时的 1.5 倍
- 同一 skillTag 连续错误 2 次以上

强项判断规则：某个 skillTag 满足以下条件，可视为强项：
- 正确率不低于 85%
- 平均用时不超过目标用时的 1.2 倍
- 当日样本数不少于 3 题

掌握度更新规则：每个 skillTag 都有 masteryScore，范围为 0-100。
训练完成后更新掌握度：新掌握度 = 旧掌握度 * 0.8 + 今日表现分 * 0.2
今日表现分由两个指标组成：正确率分占 70%、速度分占 30%
如果某个 skillTag 当天没有出现，则该 skillTag 的 masteryScore 不更新。

---

## 十四、src/services/variantService.ts 要求

请在 src/services/variantService.ts 中实现：

- generateErrorVariants(record, count)

要求：
- 每道错题生成 2 道同 skillTag 的变式题
- 变式题不能和原题完全相同
- 变式题答案由程序计算
- 变式题不进入当日 100 题统计
- 第一版只用于复盘展示，不要求孩子提交答案
- 不使用 AI

---

## 十五、src/services/reportService.ts 要求

请在 src/services/reportService.ts 中实现：

- generateWrongQuestionExplanation(record)
- generateParentDailyReport(session, records, masteries)
- getMainErrorTypes(records)
- formatSkillName(skillTag)

家长日报必须包含：今日完成题数、正确题数、正确率、总用时、平均单题用时、强项题型、弱项题型、主要错误类型、明日建议、家长关注点、本地数据说明

错题讲解必须是模板生成：不使用 AI、不编造数据、不生成新训练题、只解释当前题型和错误类型、简短温和适合家长和孩子一起看

---

## 十六、TrainingPage 交互要求

TrainingPage 必须实现完整训练状态流：

1. 进入页面时创建临时 sessionId
2. 只生成第 1 组 25 题
3. 每道题开始时记录 startTime
4. 用户提交后立即判题
5. 生成 AnswerRecord 并暂存在页面状态中
6. 答对显示"答对了！"
7. 答错显示"正确答案：X，这题先记下，最后一起看。"
8. 反馈停留 0.5-2 秒后自动进入下一题
9. 第 25、50、75 题完成后显示休息页
10. 休息页期间调用 generateNextTrainingBlock 生成下一组题
11. 完成 100 题后：保存 AnswerRecord、生成 DailySession、保存 DailySession、更新 SkillMastery、跳转 /result/:sessionId

注意：
- 不要一次性生成完整 100 题
- 不要每答一题就重新调整下一题
- 第一版只做每 25 题一次组间动态调整
- 答错后不要让孩子当场重做
- 答错后不要显示长篇讲解

---

## 十七、答题反馈规则

每道题提交后，系统立即判题。

答对时：显示"答对了！"，停留 0.5-1 秒，然后自动进入下一题。

答错时：显示"正确答案：X，这题先记下，最后一起看。"，停留 1.5-2 秒，然后自动进入下一题。

要求：当场显示正确答案、不展开详细讲解、不要求当场重做、所有错题进入结果页复盘、结果页集中展示错题正确答案错误类型简短讲解和 2 道变式题

---

## 十八、路由实现要求

请在 src/App.tsx 中使用 HashRouter。

必须包含以下路由：
- path="/" -> HomePage
- path="/training" -> TrainingPage
- path="/result/:sessionId" -> ResultPage
- path="/report/:sessionId" -> ReportPage

由于使用 HashRouter，线上实际 URL 会表现为：
- https://用户名.github.io/math-adaptive-trainer/#/
- https://用户名.github.io/math-adaptive-trainer/#/training
- https://用户名.github.io/math-adaptive-trainer/#/result/:sessionId
- https://用户名.github.io/math-adaptive-trainer/#/report/:sessionId

不要使用 BrowserRouter。

---

## 十九、UI 要求

整体 UI 要求：适合 MatePad 横屏、大字体、大按钮、页面干净、儿童友好、触屏友好、不使用排行榜、不羞辱错误、不使用复杂动画、家长报告清晰、训练页不要放无关元素、错误提示温和、结果页重点突出正确率错题和建议

CSS 要求：使用普通 CSS、不引入大型 UI 框架、页面最大宽度适合平板横屏、按钮适合触屏点击、输入框数字足够大、颜色温和不使用刺眼红色羞辱错误、休息页要简洁提示孩子休息一下

---

## 二十、package.json 要求

请包含必要依赖：react、react-dom、react-router-dom、dexie、uuid

请包含开发依赖：typescript、vite、@vitejs/plugin-react、gh-pages、@types/react、@types/react-dom、@types/uuid

scripts 至少包含：
- "dev": "vite"
- "build": "tsc && vite build"
- "preview": "vite preview"
- "predeploy": "npm run build"
- "deploy": "gh-pages -d dist"

---

## 二十一、vite.config.ts 要求

vite.config.ts 必须：使用 React 插件、配置 base: "/math-adaptive-trainer/"

示例要求：base: "/math-adaptive-trainer/"

不要默认使用 base: "/"

---

## 二十二、GitHub Pages 部署说明要求

最后请输出清晰的部署步骤：

1. 创建 GitHub 仓库 math-adaptive-trainer
2. 将代码推送到 GitHub
3. 安装依赖
4. 本地运行
5. 构建项目
6. 执行 npm run deploy
7. 在 GitHub Pages 设置中确认发布来源
8. 使用 MatePad 浏览器访问：https://用户名.github.io/math-adaptive-trainer/

请明确说明：
- GitHub Pages 只托管静态页面
- IndexedDB 数据只存在 MatePad 当前浏览器
- 换设备访问不会同步训练记录
- 清除浏览器数据会删除本地训练记录
- 第一版不做云端备份

---

## 二十三、输出要求

请直接输出：
1. 项目目录结构
2. 所有核心文件完整代码
3. 安装依赖方法
4. 本地运行方法
5. 构建方法
6. GitHub Pages 部署方法
7. MatePad 访问方法
8. MVP 验收标准
9. 如何手动测试 100 题训练闭环
10. 如何验证 GitHub Pages 路由不会刷新 404
11. 如何验证数据只保存在本地 IndexedDB

---

## 二十四、MVP 验收标准

MVP 验收标准必须包含：
1. 首页能打开
2. 点击开始训练后进入训练页
3. 第 1 组只生成 25 题
4. 每题能输入答案并提交
5. 系统能立即判断对错
6. 答对有轻反馈
7. 答错显示正确答案和温和提示
8. 第 25 题后出现休息页
9. 休息页后动态生成第 2 组
10. 第 50 题后动态生成第 3 组
11. 第 75 题后动态生成第 4 组
12. 完成 100 题后进入结果页
13. 结果页显示正确率、总用时、平均用时
14. 结果页显示错题列表
15. 每道错题显示 2 道变式题
16. 家长日报页能显示强项、弱项、明日建议
17. 刷新页面后最近训练记录仍然存在
18. 重置数据后本地记录清空
19. npm run build 成功
20. npm run deploy 能发布到 GitHub Pages
21. GitHub Pages 地址可以在 MatePad 浏览器打开
22. /#/training、/#/result/:sessionId、/#/report/:sessionId 刷新不出现 404
23. 换设备访问同一 GitHub Pages URL 不会看到原设备训练数据

---

## 二十五、手动测试要求

请在输出最后提供手动测试步骤，包括：
1. 本地打开首页
2. 点击开始训练
3. 连续答题到第 25 题
4. 确认出现休息页
5. 确认第 2 组动态生成
6. 继续完成第 50、75、100 题
7. 确认完成后进入结果页
8. 检查错题和变式题
9. 进入家长日报页
10. 刷新页面确认数据仍在
11. 回首页确认最近训练摘要
12. 点击重置数据确认清空
13. npm run build
14. npm run deploy
15. MatePad 浏览器访问 GitHub Pages URL

---

## 二十六、严格限制

请严格保持 MVP 范围。

不要增加额外功能。不要新增页面。不要加入 AI。不要加入 Mock AI。不要加入后端。不要加入账号系统。不要加入云同步。不要加入 PWA Service Worker。不要加入排行榜、徽章、周报、30 天评估。不要实现 M1、M2、速度冲刺。不要把 BrowserRouter 用于本项目。不要把 vite base 配置成 "/"。不要把主要训练数据放到 localStorage。

最终目标只有一个：MatePad 浏览器打开 GitHub Pages 网页后，孩子可以完成一次 100 题训练；系统每 25 题根据表现动态调整；训练结束后显示结果页和家长日报；所有数据保存在当前浏览器 IndexedDB 中。
