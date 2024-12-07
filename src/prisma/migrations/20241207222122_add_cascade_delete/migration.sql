-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_filterGroupId_fkey";

-- DropForeignKey
ALTER TABLE "FilterGroup" DROP CONSTRAINT "FilterGroup_filterConditionId_fkey";

-- DropForeignKey
ALTER TABLE "FilterGroup" DROP CONSTRAINT "FilterGroup_parentGroupId_fkey";

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_filterGroupId_fkey" FOREIGN KEY ("filterGroupId") REFERENCES "FilterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterGroup" ADD CONSTRAINT "FilterGroup_filterConditionId_fkey" FOREIGN KEY ("filterConditionId") REFERENCES "FilterCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterGroup" ADD CONSTRAINT "FilterGroup_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "FilterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
