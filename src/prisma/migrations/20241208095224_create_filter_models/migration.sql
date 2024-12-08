-- CreateEnum
CREATE TYPE "FilterGroupOperator" AS ENUM ('AND', 'OR');

-- CreateEnum
CREATE TYPE "FilterConditionOperator" AS ENUM ('EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'GREATER_THAN_EQUALS', 'LESS_THAN', 'LESS_THAN_EQUALS', 'CONTAINS');

-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filterGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterGroup" (
    "id" TEXT NOT NULL,
    "operator" "FilterGroupOperator",
    "filterConditionId" TEXT,
    "parentGroupId" TEXT,

    CONSTRAINT "FilterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterCondition" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "operator" "FilterConditionOperator" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FilterCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Filter_filterGroupId_key" ON "Filter"("filterGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FilterGroup_filterConditionId_key" ON "FilterGroup"("filterConditionId");

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_filterGroupId_fkey" FOREIGN KEY ("filterGroupId") REFERENCES "FilterGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterGroup" ADD CONSTRAINT "FilterGroup_filterConditionId_fkey" FOREIGN KEY ("filterConditionId") REFERENCES "FilterCondition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterGroup" ADD CONSTRAINT "FilterGroup_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "FilterGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterCondition" ADD CONSTRAINT "FilterCondition_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
