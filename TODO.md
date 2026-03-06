# 🚀 OpenClaw Assistant: Project Roadmap & Ideas

這個檔案記錄了目前 `openclaw-assistant` 的核心任務、腦力激盪中的想法以及待辦事項。

## 💬 近期喜歡的句子
- 卡片盒筆記的關鍵，是把思考的脈絡呈現出來。


## 📋 當前任務 (Current Tasks)

### 🌐 個人網站 (Personal Website)
- **描述**：建立 Fredrick 的個人數位分身/智識展示平台。
  - [x] 技術選型討論 (Astro vs. Next.js)
  - [x] 內容本質定義 (要放哪些思維模型、專案、或是 Release Notes?)
  - [x] 部署方案確認 (Vercel/GitHub Pages/Self-hosted)
  - [x] 部落格轉型研究：分析熱門部落客文章特質（結構、語氣、美感、互動），作為內容產出的參考。

### 🧠 系統加固：Memory & Handoff 自動化 (System Hardening)
- **描述**：優化 `generate_handoff.py` 與 `MEMORY.md` 的連動邏輯，減少重工。
  - [ ] 定義「專案細節」與「長期智識」的自動過濾規則。
  - [ ] 實作自動化腳本，在 Handoff 時同步更新 `MEMORY.md` 的關鍵摘要。

### 📬 Gmail 帳單自動解析工具
- **描述**：從 Gmail 抓取帳單郵件，透過 AI 解析金額與分類，產生記帳儀表板。採 gws CLI 取代手刻 Gmail API 層，MVP 先做個人工具版本。
  - [x] 評估 gws CLI vs 手刻 Gmail API（決策：MVP 用 gws，省 3 天工時）
  - [ ] gws auth setup，完成 OAuth 設定
  - [ ] 用 gws gmail 指令實作郵件抓取（取代 Phase 1 & 2）
  - [ ] Email Parser：解析金額、日期、商家名稱
  - [ ] AI Classifier：LLM 自動分類帳單類型
  - [ ] SQLite 資料庫設計與建立
  - [ ] REST API + 前端 Dashboard 串接
  - [ ] 部署（Railway / Render）

### 🔧 hl-workflow：AI 工作流自動化工具
- **描述**：打造個人化的 AI workflow 工具，初版已上 GitHub（fredrick84823/hl-workflow），需要人工 review 與持續迭代。
  - [x] 初版實作並推上 GitHub
  - [ ] 人工 review 初版程式碼與架構
  - [ ] 修正 review 發現的問題
  - [ ] 定義下一版功能範圍

### ✍️ 發表文章 (Content Publishing)
- **描述**：持續產出技術與思維文章，記錄工程心得與工具使用經驗。
  - [x] GitHub 作為第二大腦：Threads 短篇貼文
  - [ ] GitHub 作為第二大腦：Medium 長篇文章
  - [ ] skill-creator 介紹與測試心得（功能介紹 + 實測 eval 結果）
  - [ ] 用 claude.ai chat 做個人記帳網頁的開發經驗分享

## 💡 腦力激盪：心智模型與方法論 (Mental Models & Methodologies)
- **描述**：探索如何將各種哲學與工程思維模型整合進 OpenClaw 的工作流。
- **GitHub 分散式記憶 (Distributed Memory)**：如何透過 Git-based 架構實現跨 Agent 的心智繼承？
- **第一性原理 (First Principles)**：如何讓 AI 在分析問題時自動拆解至底層邏輯？
- **辯證式架構師 (Dialectical Architect)**：強化「魔鬼代言人」模式，提供更具衝擊力的 C 選項。
- **熵對抗 (Entropy Resistance)**：如何透過自動化整理，防止數位知識庫隨時間變得混亂？
- **人生原型迭代 (Life Prototype)**：將個人目標視為可開發、可測試的產品原型。

---
*最後更新日期：2026-03-06*
