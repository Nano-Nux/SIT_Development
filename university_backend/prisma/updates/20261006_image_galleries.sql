-- Additive update for existing installations. The project uses `prisma db push`.
-- Existing single imageUrl covers remain usable until a gallery is saved.
ALTER TABLE "News" ADD COLUMN IF NOT EXISTS "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "CampusFacility" ADD COLUMN IF NOT EXISTS "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
