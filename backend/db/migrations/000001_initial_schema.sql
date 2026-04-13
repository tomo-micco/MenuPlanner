-- Initial migration based on schema.md

-- households (家族グループ)
CREATE TABLE households (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- users (ユーザー)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- invitation_codes (招待コード)
CREATE TABLE invitation_codes (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    code VARCHAR(8) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- recipes (レシピ)
CREATE TABLE recipes (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- units (単位マスタ)
CREATE TABLE units (
    id SMALLINT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- ingredients_master (材料マスタ)
CREATE TABLE ingredients_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- recipe_ingredients (レシピ材料)
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id),
    ingredient_id INTEGER REFERENCES ingredients_master(id),
    quantity DECIMAL NOT NULL,
    unit_id SMALLINT REFERENCES units(id)
);

-- inventories (在庫管理)
CREATE TABLE inventories (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    ingredient_id INTEGER REFERENCES ingredients_master(id),
    quantity DECIMAL NOT NULL,
    unit_id SMALLINT REFERENCES units(id),
    storage_location SMALLINT NOT NULL, -- 0:冷蔵, 1:冷凍, 2:常温
    expiration_date DATE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- meal_plans (献立)
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    recipe_id UUID REFERENCES recipes(id),
    plan_date DATE NOT NULL,
    meal_type SMALLINT NOT NULL -- 0:朝, 1:昼, 2:夕
);

-- shopping_list_items (買い物リスト)
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL,
    unit_id SMALLINT REFERENCES units(id),
    category SMALLINT NOT NULL, -- 0:野菜, 1:肉, 2:魚, 3:調味料, 4:その他
    is_purchased BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP
);
