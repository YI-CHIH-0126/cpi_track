## ADDED Requirements

### Requirement: 建立價格紀錄

系統 MUST 提供可建立價格紀錄的 API 端點，包含商品名稱、價格與紀錄日期。

#### Scenario: 成功建立紀錄

- **WHEN** 用戶端送出包含 `product_name`、`price` 與 `record_date` 的有效建立請求
- **THEN** 系統在資料庫新增一筆價格紀錄，並回傳成功回應

#### Scenario: 拒絕無效價格

- **WHEN** 用戶端送出請求且 `price` 不是正數
- **THEN** 系統拒絕該請求並回傳驗證錯誤回應

### Requirement: 查詢價格紀錄列表

系統 MUST 提供可回傳已儲存價格紀錄的 API 端點，並依紀錄日期排序。

#### Scenario: 查詢有資料的列表

- **WHEN** 用戶端請求價格紀錄列表且資料已存在
- **THEN** 系統回傳依 `record_date` 排序的所有紀錄

#### Scenario: 查詢無資料的列表

- **WHEN** 用戶端請求價格紀錄列表且目前無任何紀錄
- **THEN** 系統回傳空列表與成功回應

### Requirement: 使用 SQLite 持久化價格資料

系統 MUST 將建立完成的價格紀錄持久化到 SQLite，確保伺服器重啟後資料仍可使用。

#### Scenario: 重啟後資料仍存在

- **WHEN** 伺服器在至少建立過一筆紀錄後重新啟動
- **THEN** 查詢列表端點時可取得先前已儲存的紀錄
