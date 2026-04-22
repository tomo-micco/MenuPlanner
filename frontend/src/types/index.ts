// schema.md のフロントエンド型定義 (SSOT) を一元管理するファイル

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
