import { FilterGroup, Prisma } from '@prisma/client';
import prisma from '@strutio/prisma/client';
import { map } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const filter = await prisma.filter.findUnique({
      where: { id },
    });

    if (!filter) {
      return NextResponse.json({ error: 'Filter not found' }, { status: 404 });
    }

    const filterGroups: FilterGroup[] = await prisma.$queryRaw`
      WITH RECURSIVE filter_group_tree AS (
        -- Base case: Get the starting filter group
        SELECT
          fg."id",
          fg."operator",
          fg."parentGroupId",
          fg."filterConditionId"
        FROM "FilterGroup" fg
        WHERE fg.id = ${filter.filterGroupId}
        
        UNION ALL
        
        -- Recursive case: Join subgroups
        SELECT
          fg."id",
          fg."operator",
          fg."parentGroupId",
          fg."filterConditionId"
        FROM "FilterGroup" fg
        INNER JOIN filter_group_tree fgt ON fgt."id" = fg."parentGroupId"
      )
      -- Select the full hierarchy
      SELECT * FROM filter_group_tree;
    `;

    if (!filterGroups || filterGroups.length === 0) {
      return NextResponse.json(
        { error: 'FilterGroup not found or no related FilterGroups' },
        { status: 404 },
      );
    }

    const filterGroupIds = map(filterGroups, (fg) => fg.id);
    const detailedFilterGroups = await prisma.filterGroup.findMany({
      where: {
        id: { in: filterGroupIds },
      },
      include: {
        filterCondition: {
          include: {
            attribute: true,
          },
        },
      },
    });

    const orderedFilterGroups = filterGroupIds.map((id) =>
      detailedFilterGroups.find((fg) => fg.id === id),
    );

    return NextResponse.json(
      { filter, filterGroups: orderedFilterGroups },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const filter = await prisma.filter.findUnique({
      where: { id },
      include: {
        filterGroup: true,
      },
    });

    if (!filter) {
      return NextResponse.json({ error: 'Filter not found' }, { status: 404 });
    }

    const deleteFilterGroup = async (
      groupId: string,
      tx: Prisma.TransactionClient,
    ) => {
      const filterGroup = await tx.filterGroup.findUnique({
        where: { id: groupId },
        include: {
          filterCondition: true,
          subGroups: true,
        },
      });

      if (filterGroup) {
        if (filterGroup.filterConditionId) {
          await tx.filterCondition.delete({
            where: { id: filterGroup.filterConditionId },
          });
        }

        if (filterGroup.subGroups.length) {
          for (const subGroup of filterGroup.subGroups) {
            await deleteFilterGroup(subGroup.id, tx);
          }
        }

        if (filter.filterGroupId !== groupId) {
          await tx.filterGroup.delete({
            where: { id: groupId },
          });
        }
      }
    };

    await prisma.$transaction(async (tx) => {
      const filterGroupId = filter.filterGroupId;
      await deleteFilterGroup(filterGroupId, tx);

      await tx.filter.delete({
        where: { id },
      });

      await tx.filterGroup.delete({
        where: { id: filterGroupId },
      });
    });

    return NextResponse.json(
      { message: 'Filter and related groups deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
