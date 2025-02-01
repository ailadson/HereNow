/*
  Warnings:

  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tagline" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "externalLink" TEXT,
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "tagline" TEXT NOT NULL,
ADD COLUMN     "videoURL" TEXT;
