# 在庫管理機能 詳細設計書

## 1. 機能概要
家庭内の食材在庫（冷蔵庫、冷凍庫、常温保存）を管理し、食品ロス削減と効率的な献立作成を支援する。買い物リストからの自動追加、調理による消費、賞味期限管理を行う。

## 2. データモデル (schema.md 準拠)

`inventories` テーブルを使用する。

| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | 在庫ID |
| household_id | UUID | REFERENCES households(id) | 所有家族ID |
| ingredient_id | SMALLINT | REFERENCES ingredients_master(id) | 材料マスタID |
| quantity | DECIMAL | NOT NULL | 在庫数 |
| unit_id | SMALLINT | REFERENCES units(id) | 単位マスタID |
| storage_location | SMALLINT | NOT NULL | 0:冷蔵, 1:冷凍, 2:常温 |
| expiration_date | DATE | | 賞味期限 |
| updated_at | TIMESTAMP | NOT NULL | 最終更新日時 |

## 3. API設計
- `GET /inventories`
    - 在庫一覧を取得。`storage_location` でのフィルタリングが可能。
- `POST /inventories`
    - 在庫の新規登録・手動調整。
- `PUT /inventories/{id}`
    - 数量、場所、賞味期限の更新。
- `DELETE /inventories/{id}`
    - 在庫の削除。
- `POST /inventories/consume`
    - 調理による消費処理。リクエストに材料マスタIDと数量のリストを含む。

## 4. UI/UX設計
- **在庫一覧ビュー**:
    - 冷蔵・冷凍・常温のタブ切り替え。
    - 賞味期限が近いアイテム（例：3日以内）を赤色で強調表示。
- **自動連携**:
    - 買い物リストで「購入済み」をチェックした際、自動的に在庫へ追加される（単位変換が必要な場合はダイアログを表示）。
    - 献立の「調理完了」をマークした際、レシピに基づいた材料を在庫から減算する確認ダイアログを表示。

## 5. ロジック・制約
- **材料マスタ連携**: 在庫として登録されるアイテムは、必ず `ingredients_master` に紐づく必要がある。
- **単位の正規化**: 買い物リストやレシピと在庫で単位が異なる場合（例：個とg）、変換テーブルまたはユーザーへの入力を介して数量を正規化する。
