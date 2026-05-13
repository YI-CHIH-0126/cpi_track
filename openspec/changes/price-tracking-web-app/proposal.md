## Why

目前專案只有基礎 Express 骨架，尚未具備可持續記錄與查詢商品價格變化的功能。現在建立價格追蹤能力，可以先完成最小可用版本（MVP），讓使用者能輸入日期、商品名稱與價格，並在後續擴充圖表與分析功能。

## What Changes

- 新增商品價格記錄功能，支援建立價格資料（日期、商品名稱、價格）。
- 新增價格資料查詢功能，支援列出歷史記錄並依日期排序。
- 新增前端頁面與互動邏輯，提供表單輸入與列表檢視。
- 新增 SQLite 資料儲存層，持久化價格記錄資料。
- 新增後端 API（Express）供前端建立與讀取價格資料。

## Capabilities

### New Capabilities

- `price-entry-management`: 管理商品價格記錄的建立與基本查詢行為。
- `price-tracking-ui`: 提供網頁介面讓使用者輸入與檢視價格變化資料。

### Modified Capabilities

- None.

## Impact

- Affected code: `myexpress/app.js`, `myexpress/routes/*`, `myexpress/public/*`，以及新增資料庫相關模組。
- API: 新增價格記錄相關 REST endpoints（例如建立與查詢）。
- Dependencies: 新增 SQLite 存取套件（例如 `sqlite3` 或同類工具）。
- Systems: 新增本機 SQLite 檔案與初始化流程。
