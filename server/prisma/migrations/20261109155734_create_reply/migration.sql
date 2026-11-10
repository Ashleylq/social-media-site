-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "commented_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reply" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "commented_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_reply likes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_reply likes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_comment likes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_comment likes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_reply likes_B_index" ON "_reply likes"("B");

-- CreateIndex
CREATE INDEX "_comment likes_B_index" ON "_comment likes"("B");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reply likes" ADD CONSTRAINT "_reply likes_A_fkey" FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reply likes" ADD CONSTRAINT "_reply likes_B_fkey" FOREIGN KEY ("B") REFERENCES "reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comment likes" ADD CONSTRAINT "_comment likes_A_fkey" FOREIGN KEY ("A") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comment likes" ADD CONSTRAINT "_comment likes_B_fkey" FOREIGN KEY ("B") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
