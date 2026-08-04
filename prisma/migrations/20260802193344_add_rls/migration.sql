ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Product" FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow_select_products" ON "Product" FOR
SELECT
    USING (true);

CREATE POLICY "Block_insert_non_admins_products" ON "Product" FOR INSERT
WITH
    CHECK (
        current_setting ('app.current_user_role', true) = 'admin'
    );

CREATE POLICY "Block_update_non_admins_products" ON "Product" FOR
UPDATE USING (
    current_setting ('app.current_user_role', true) = 'admin'
);

CREATE POLICY "Block_delete_non_admins_products" ON "Product" FOR DELETE USING (
    current_setting ('app.current_user_role', true) = 'admin'
);