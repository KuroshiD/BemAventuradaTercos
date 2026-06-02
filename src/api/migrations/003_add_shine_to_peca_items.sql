-- Add shine column to peca_item table
ALTER TABLE peca_item
ADD COLUMN IF NOT EXISTS shine BOOLEAN NOT NULL DEFAULT FALSE;
