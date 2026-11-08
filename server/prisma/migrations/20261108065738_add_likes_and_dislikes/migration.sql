-- CreateTable
CREATE TABLE "_like" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_like_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_dislike" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_dislike_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_like_B_index" ON "_like"("B");

-- CreateIndex
CREATE INDEX "_dislike_B_index" ON "_dislike"("B");

-- AddForeignKey
ALTER TABLE "_like" ADD CONSTRAINT "_like_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_like" ADD CONSTRAINT "_like_B_fkey" FOREIGN KEY ("B") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislike" ADD CONSTRAINT "_dislike_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislike" ADD CONSTRAINT "_dislike_B_fkey" FOREIGN KEY ("B") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
