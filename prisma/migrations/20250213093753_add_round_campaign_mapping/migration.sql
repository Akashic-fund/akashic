-- CreateTable
CREATE TABLE "RoundCampaigns" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,

    CONSTRAINT "RoundCampaigns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoundCampaigns" ADD CONSTRAINT "RoundCampaigns_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundCampaigns" ADD CONSTRAINT "RoundCampaigns_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
