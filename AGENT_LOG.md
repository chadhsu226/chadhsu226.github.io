# AGENT_LOG — 異動紀錄

每次改動這個 repo 的 agent，動工前先讀這裡最上面幾筆、了解目前狀態；完成後在最上面新增一筆，格式如下：

## YYYY-MM-DD — <Claude|Codex> — 一句話標題
- 做了什麼：
- 為什麼：
- 動到的檔案：
- Commit：<commit hash 或連結>

---

## 2026-10-28 — Claude — 首頁新增「學群介紹」卡片與三個財經學群互動頁
- 做了什麼：新增 clusters/finance-management-islands.html（財經暨管理群島_動態地圖）、clusters/finance-islands.html（財經群島_動態地圖）、clusters/mcu-campus-tour.html（銘傳管理學院_校園導覽）；首頁「精選課程」加入第 7 張卡片（div 卡片內含三個連結）
- 為什麼：Sean 的高中學群介紹素材（來源：本機「財經學群介紹」資料夾），檔名改為英文避免 URL 編碼
- 動到的檔案：index.html、AGENT_LOG.md、clusters/*.html
- Commit：（見本次 commit）

## 2026-10-21 — Claude — 新增「Math exercises for my son」（AMC 10 講義站）與首頁卡片
- 做了什麼：建立 amc10 repo（index、chapters/chapter_01–18.html、videos/ 第 1–8 章 32 支 MP4 與 VTT 字幕、robots.txt、.nojekyll），啟用 GitHub Pages；首頁「精選課程」加入第 6 張卡片
- 為什麼：Sean 為兒子準備 AMC 10。所有 HTML 以 StatiCrypt（AES，記住 30 天）加密，密碼不寫入 repo；影片暫放 repo（未加密），YouTube 不公開版傳完後改為嵌入並移除 MP4；歷屆真題 PDF 不上傳（版權）
- 重建：本機 AMC10/site_build/build.py 產生明文頁，再用 npx staticrypt@3 加密（salt 存於 site_build/staticrypt.json，需沿用同一 salt 才能跨頁記住密碼）
- 動到的檔案：index.html、AGENT_LOG.md；新 repo chadhsu226/amc10
- Commit：（見本次 commit）

## 2026-10-14 — Claude — 新增「Python 與金融資料分析」課程站與首頁卡片
- 做了什麼：建立 python-finance repo（課程首頁、單元 1–7 講義、data/*.csv、資料說明.md、.nojekyll），啟用 GitHub Pages；首頁「精選課程」加入第 5 張卡片，格線改為 lg:grid-cols-3
- 為什麼：Sean 新開 R與Python（Python 部分）課程；教材由另一個 Claude 專案撰寫於 R與Python_115 資料夾，本 repo 端負責同步，依該資料夾的「發布說明.md」決定發布哪些檔案（教師用檔案不公開）
- 動到的檔案：index.html、AGENT_LOG.md；新 repo chadhsu226/python-finance
- Commit：（見本次 commit）

---

## 2026-09-07 — Claude — 建立 Claude/Codex 共用協作機制
- 做了什麼：新增本檔案、AGENTS.md、CLAUDE.md（指向 AGENTS.md）
- 為什麼：Sean 要讓 Codex 加入這個 repo 的開發維護，兩個 agent 需要讀同一份規則、看得到對方的異動紀錄，避免衝突或狀態遺漏
- 動到的檔案：AGENTS.md, CLAUDE.md, AGENT_LOG.md（新增）
- Commit：（見本次 commit）
