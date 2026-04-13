# データ構造定義 (scheme.md)

このドキュメントは、プロジェクトにおけるデータ構造の唯一の正解 (SSOT) です。実装の際は必ず本定義を参照し、変更が必要な場合は実装前に本ファイルを更新してください。

## 1. データベーススキーマ (PostgreSQL)

命名規則: `snake_case`

### households (家族グループ)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | 家族ID |
| name | VARCHAR(255) | NOT NULL | 家族名（例：田中家） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

### users (ユーザー)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | ユーザーID |
| household_id | UUID | REFERENCES households(id) | 所属家族ID |
| name | VARCHAR(255) | NOT NULL | ユーザー名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

### invitation_codes (招待コード)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | ID |
| household_id | UUID | REFERENCES households(id) | 家族ID |
| code | VARCHAR(8) | UNIQUE, NOT NULL | 招待コード |
| expires_at | TIMESTAMP | NOT NULL | 有効期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

### recipes (レシピ)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | レシピID |
| household_id | UUID | REFERENCES households(id) | 所有家族ID |
| title | VARCHAR(255) | NOT NULL | レシピ名 |
| description | TEXT | | 説明/メモ |
| image_url | TEXT | | 画像URL |
| is_ai_generated | BOOLEAN | DEFAULT FALSE | AI生成フラグ |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

### units (単位マスタ)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | SMALLINT | PRIMARY KEY | ID |
| name | VARCHAR(20) | NOT NULL | 単位名 |

### ingredients_master (材料マスタ)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | SMALLINT | PRIMARY KEY | 材料ID |
| name | VARCHAR(255) | NOT NULL | 材料名 |

### recipe_ingredients (レシピ材料)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | ID |
| recipe_id | UUID | REFERENCES recipes(id) | 紐づくレシピID |
| ingredient_id | SMALLINT | REFERENCES ingredients_master(id) | 材料マスタID |
| quantity | DECIMAL | NOT NULL | 分量 |
| unit_id | SMALLINT | REFERENCES units(id) | 単位マスタID |

### inventories (在庫管理)
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

### meal_plans (献立)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | 献立ID |
| household_id | UUID | REFERENCES households(id) | 所有家族ID |
| recipe_id | UUID | REFERENCES recipes(id) | レシピID |
| plan_date | DATE | NOT NULL | 予定日 |
| meal_type | SMALLINT | NOT NULL | 0:朝, 1:昼, 2:夕 |

### shopping_list_items (買い物リスト)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | ID |
| household_id | UUID | REFERENCES households(id) | 所有家族ID |
| name | VARCHAR(255) | NOT NULL | アイテム名 |
| quantity | DECIMAL | | 数量 |
| unit_id | SMALLINT | REFERENCES units(id) | 単位マスタID |
| category | SMALLINT | NOT NULL | 0:野菜, 1:肉, 2:魚, 3:調味料, 4:その他 |
| is_purchased | BOOLEAN | DEFAULT FALSE | 購入済みフラグ |
| purchased_at | TIMESTAMP | | 購入完了日時 |

---

## 2. バックエンド型定義 (Go)

```go
type RecipeIngredient struct {
	ID       string  `json:"id"`
	RecipeID string  `json:"recipeId"`
	Name     string  `json:"name"`
	Quantity float64 `json:"quantity"`
	UnitID   int16   `json:"unitId"`
}

type Inventory struct {
	ID              string     `json:"id"`
	HouseholdID     string     `json:"householdId"`
	IngredientID    int16      `json:"ingredientId"`
	Quantity        float64    `json:"quantity"`
	UnitID          int16      `json:"unitId"`
	StorageLocation int16      `json:"storageLocation"`
	ExpirationDate  *time.Time `json:"expirationDate,omitempty"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

type ShoppingListItem struct {
	ID          string     `json:"id"`
	HouseholdID string     `json:"householdId"`
	Name        string     `json:"name"`
	Quantity    float64    `json:"quantity"`
	UnitID      int16      `json:"unitId"`
	Category    int16      `json:"category"`
	IsPurchased bool       `json:"isPurchased"`
	PurchasedAt *time.Time `json:"purchasedAt,omitempty"`
}
```

---

## 3. フロントエンド型定義 (TypeScript)

```typescript
export interface IHousehold {
  id: string;
  name: string;
  createdAt: string;
}

export interface IUser {
  id: string;
  householdId: string | null;
  name: string;
  email: string;
  createdAt: string;
}

export interface IInvitationCode {
  id: string;
  householdId: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

export interface IRecipeIngredient {
  id: string;
  recipeId: string;
  name: string;
  quantity: number;
  unitId: number;
}

export interface IInventory {
  id: string;
  householdId: string;
  ingredientId: number;
  quantity: number;
  unitId: number;
  storageLocation: number; // 0:冷蔵, 1:冷凍, 2:常温
  expirationDate?: string;
  updatedAt: string;
}

export interface IShoppingListItem {
  id: string;
  householdId: string;
  name: string;
  quantity: number;
  unitId: number;
  category: number; // 0:野菜, 1:肉, 2:魚, 3:調味料, 4:その他
  isPurchased: boolean;
  purchasedAt?: string;
}
```
