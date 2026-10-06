-- The homepage no longer stores a manually selected video poster.
UPDATE "Hero"
SET "imageUrl" = NULL
WHERE "page" = 'HOME';
