# 買い物リスト管理機能 詳細設計書

## 1. 機能概要
献立情報から必要な材料を自動抽出し、カテゴリ分けされた買い物リストを作成・管理する機能。手動追加や購入完了時の在庫反映も行う。

## 2. データモデル (schema.md 準拠)
`shopping_list_items` テーブルを使用。

| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | ID |
| household_id | UUID | REFERENCES households(id) | 家族ID |
| name | VARCHAR(255) | NOT NULL | アイテム名 |
| quantity | DECIMAL | | 数量 |
| unit | VARCHAR(50) | | 単位 |
| category | VARCHAR(50) | NOT NULL | VEGETABLE, MEAT, FISH, SEASONING, OTHER |
| is_purchased | BOOLEAN | DEFAULT FALSE | 購入済みフラグ |
| purchased_at | TIMESTAMP | | 購入完了日時 (自動削除判定用) |

## 3. API設計
- `GET /shopping-lists`
    - 現在の買い物リストを取得（is_purchased=false のアイテムのみ）
- `POST /shopping-lists/generate`
    - 週間献立から買い物リストを自動生成
- `POST /shopping-lists/items`
    - 手動アイテムの追加
- `PATCH /shopping-lists/items/{id}/purchase`
    - 購入完了処理。在庫への反映（条件分岐あり）と `purchased_at` の更新を行う

## 4. UI/UX設計
- **カテゴリ分類リスト**: 野菜、肉、魚、調味料、その他に分類して表示。
- **手動追加モーダル**: アイテム名とカテゴリ選択を必須項目として入力。
- **購入完了アクション**:
    - リスト上のチェックボックスで完了。
    - 在庫との単位照合ロジック:
        - 一致: 自動的に在庫へ加算。
        - 不一致: 在庫調整用モーダルを表示し、ユーザーに数量・単位を確認・修正させる。

## 5. ロジック・制約
- **自動削除**: `purchased_at` が設定されてから二週間経過したアイテムは、バッチ処理またはアクセス時にハード削除する。
- **カテゴリ定義**: システム固定（野菜、肉、魚、調味料、その他）。
