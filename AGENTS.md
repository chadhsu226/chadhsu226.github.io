# AGENTS.md — 給協作 AI Agent 的說明（Claude、Codex 共用）

這個檔案是這個 repo 的規則來源。不管是 Claude 或 Codex 要動這個 repo，開工前都先讀這份文件；`CLAUDE.md` 只是指向這裡的入口，避免兩邊各存一份規則而不同步、日久漂移。

## 這個 repo 是什麼
Sean（許智翔）的個人首頁 `chadhsu226.github.io`，是所有課程講義站、教學工具、遊戲站台的入口頁（連到 Statistics1、Statistics2、行為財務學、2026_財數、teacher_tool、games 等 repo）。

## 動工前一定要做的事
1. 先讀 `AGENT_LOG.md` 最上面幾筆，了解最近誰改了什麼、為什麼——不要只看 git diff，log 裡有意圖和決策脈絡。
2. 一律以 GitHub 上的最新 HEAD 為基底工作。本機資料夾（`C:\Users\cchsu\Desktop\my github\Main`）只是備份用途，不是工作副本，可能不是最新版。
3. 修改既有檔案（例如 index.html）時，先讀 git HEAD 版本，用字串替換、替換前 assert 舊字串存在，不要整份覆寫猜內容。

## 部署 / 推送流程
- GitHub 帳號：chadhsu226。Token 放在本機資料夾的 `token.txt`——直接讀取使用，絕不在對話或指令輸出中顯示（輸出時用 sed 遮蔽）。
- 在 `/dev/shm`（不要用 /tmp）以 token fresh clone 這個 repo，單一指令內完成：clone → 寫檔 → 驗證 → commit → push。
- 推送前驗證：HTML 檔以 `</html>` 結尾（用 errors='strict' 讀取，確認沒有編碼問題）、`<script>` 區塊數量正確、最後一個 `<script>` 要能通過 `node --check`。
- Commit 作者要標明是哪個 agent：`Claude (for Sean)` 或 `Codex (for Sean)`，方便之後用 git log 分辨誰動的。
- 新建或修改的檔案，同時在本機資料夾對應位置存一份備份。
- push 後等約 40 秒，用 curl 加 cache-buster（例如 `?v=時間戳`）確認線上版本已更新、頁面完整。

## 內容原則
- 範例、習題、情境、數據要完全原創（情境結構也不能只是換品牌換數字），避免版權爭議。
- 可延續既有世界觀（星夜客運、日光咖啡、沐茶、租屋行情）讓內容彼此連貫。
- 全程使用繁體中文。
- 講義版型可參考 Statistics1 repo 的 `ch7_discrete_rv.html`（深色學術風、KaTeX、quiz/exercises/summary 結構）。

## 完成一個任務之後
- 一定要在 `AGENT_LOG.md` 最上面加一筆紀錄（日期、agent 名稱、做了什麼、為什麼、動到哪些檔案、commit），格式見該檔案內的範例。
- 如果這個任務是 Sean 用 GitHub Issue 交辦的，完成後在該 issue 留言貼 commit 連結再關閉。

## 目前的分工共識
- 每日早報、每週遊戲設計：目前由 Claude 端的排程任務負責（狀態延續性較高，維持固定），不要重複建立同類排程。
- 其他新任務由 Sean 逐項指派給 Claude 或 Codex。兩邊都應假設「對方可能剛動過這個 repo」，動工前務必先讀 AGENT_LOG.md + pull 最新 HEAD。
