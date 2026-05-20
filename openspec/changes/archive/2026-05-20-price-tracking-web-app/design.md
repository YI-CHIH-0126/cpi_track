## Context

目前專案是基本 Express 範本，前端頁面與後端路由已存在，但沒有資料持久化與價格追蹤領域模型。此變更需要同時跨越前端（表單輸入與列表展示）、後端 API（建立/查詢價格記錄）與資料層（SQLite）。

限制條件如下：

- 前端限定使用 HTML、CSS、JavaScript（不引入大型前端框架）。
- 後端使用 Express。
- 資料庫使用 SQLite，優先滿足單機與小型資料量情境。

## Goals / Non-Goals

**Goals:**

- 提供可用的 MVP，讓使用者可新增一筆價格記錄（日期、商品名、價格）。
- 提供歷史記錄列表查詢，供使用者檢視價格變化資料。
- 定義清楚的 API 與資料模型，便於後續擴充（例如趨勢圖、過濾條件）。
- 確保輸入資料有最小驗證，避免無效資料進入資料庫。

**Non-Goals:**

- 不包含使用者登入/權限系統。
- 不包含自動爬蟲或外部電商價格抓取。
- 不包含進階分析（例如統計預測、告警通知）。

## Decisions

1. 使用 REST API 分離前後端責任

- Decision: 提供 `POST /api/prices`（新增）與 `GET /api/prices`（查詢）兩個核心端點。
- Rationale: 與原生前端 `fetch` 整合簡單，介面清晰，測試成本低。
- Alternatives considered:
  - 直接伺服器端模板渲染與表單提交：實作更快，但前後端耦合較高，後續擴充互動功能不便。
  - GraphQL：過度設計，對 MVP 成本偏高。

2. 使用 SQLite 單表儲存價格記錄

- Decision: 建立 `price_records` 表，欄位至少包含 `id`, `product_name`, `price`, `record_date`, `created_at`。
- Rationale: SQLite 無需獨立伺服器，適合目前本地或小規模部署。
- Alternatives considered:
  - JSON 檔案儲存：容易損壞且缺乏查詢能力。
  - PostgreSQL：可擴充性更佳，但初期部署與維運成本較高。

3. 在後端實作輸入驗證作為主防線

- Decision: 後端驗證 `product_name` 非空、`price` 為正數、`record_date` 符合日期格式。
- Rationale: 前端驗證可提升體驗，但後端驗證才是資料一致性的保證。
- Alternatives considered:
  - 僅前端驗證：可被繞過，不可靠。

4. 前端採單頁基礎互動（非 SPA 框架）

- Decision: 使用單一 HTML 頁面，透過 JavaScript 呼叫 API，提交成功後刷新列表。
- Rationale: 符合技術限制，開發速度快，利於教學與維護。
- Alternatives considered:
  - 導入 React/Vue：超出目前需求與限制。

## Risks / Trade-offs

- [Risk] SQLite 在高併發寫入下表現受限 → Mitigation: 先以 MVP 流量為前提，保留後續資料層抽換空間。
- [Risk] 日期格式不一致導致排序異常 → Mitigation: API 只接受標準化日期字串，查詢時統一排序規則。
- [Risk] 使用者輸入錯誤資料（空名稱、非數字價格） → Mitigation: 前後端雙重驗證並回傳可讀錯誤訊息。
- [Trade-off] 不使用 ORM 可減少依賴與學習成本，但需自行維護 SQL 與資料映射。

## Migration Plan

1. 新增 SQLite 依賴並建立資料庫初始化程式。
2. 建立 `price_records` 資料表與必要索引（例如 `record_date`）。
3. 新增 Express 路由與控制邏輯，實作建立/查詢 API。
4. 前端新增輸入表單、提交邏輯與歷史列表渲染。
5. 進行手動驗證：新增資料、重整頁面、確認資料仍存在。

Rollback strategy:

- 若新功能導致問題，可先停用 `/api/prices` 路由與前端入口，保留原有骨架功能。
- SQLite 新增檔案可獨立移除，不影響原本無資料庫的路由。

## Open Questions

- 是否需要允許同一商品同一天有多筆價格（不同通路）？
- 是否需要在 MVP 就支援依商品名稱過濾查詢？
- 金額格式是否需要固定幣別欄位（例如 TWD）？
