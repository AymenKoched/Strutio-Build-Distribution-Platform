import {
  Filter,
  FilterGroup,
  FilterGroupOperator,
  Prisma,
} from '@prisma/client';
import {
  FilterConditionDTO,
  FilterDTO,
  FilterGroupType,
} from '@strutio/models';
import prisma from '@strutio/prisma/client';
import { map } from 'lodash';

export const getFilters = async (name?: string) => {
  return prisma.filter.findMany(
    name
      ? { where: { name: { contains: name, mode: 'insensitive' } } }
      : undefined,
  );
};

export const getFilterDetails = async (id: string) => {
  const filter = await prisma.filter.findUnique({
    where: { id },
  });

  if (!filter) {
    return;
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
  ) as FilterGroupType[];

  return { filter, filterGroups: orderedFilterGroups };
};

export const createFilter = async (payload: FilterDTO) => {
  const { name, filterGroups } = payload;

  return prisma.$transaction(async (tx) => {
    const parentGroup = await createParentGroup(filterGroups, tx);

    if (!parentGroup) {
      throw new Error('Unable to create filter, parent Group is null.');
    }

    return tx.filter.create({
      data: {
        name,
        filterGroupId: parentGroup.id,
      },
    });
  });
};

export const deleteFilter = async (id: string) => {
  const filter = await prisma.filter.findUnique({
    where: { id },
    include: {
      filterGroup: true,
    },
  });

  if (!filter) {
    throw new Error('Filter not found.');
  }

  await prisma.$transaction(async (tx) => {
    const filterGroupId = filter.filterGroupId;
    await deleteFilterGroup(filterGroupId, filterGroupId, tx);

    await tx.filter.delete({
      where: { id },
    });

    await tx.filterGroup.delete({
      where: { id: filterGroupId },
    });
  });
};

export const updateFilter = async (id: string, payload: FilterDTO) => {
  const { name, filterGroups } = payload;
  const existingFilter: Filter | null = await prisma.filter.findUnique({
    where: { id },
  });

  if (!existingFilter) {
    throw new Error('Filter not found.');
  }

  await prisma.$transaction(async (tx) => {
    // Update the filter name if it has changed
    if (existingFilter.name !== name) {
      await tx.filter.update({
        where: { id },
        data: { name },
      });
    }

    // delete the old filter groups
    await deleteFilterGroup(
      existingFilter.filterGroupId,
      existingFilter.filterGroupId,
      tx,
    );

    // create parent group
    const parentGroup = await createParentGroup(filterGroups, tx);

    if (!parentGroup) {
      throw new Error('Unable to update filter, parent Group is null.');
    }

    // update filter filterGroupId and delete old parent group
    const oldFilerGroupId = existingFilter.filterGroupId;

    await tx.filter.update({
      where: { id },
      data: { filterGroupId: parentGroup.id },
    });

    await tx.filterGroup.delete({ where: { id: oldFilerGroupId } });
  });
};

// func to delete the nested filter groups and filter conditions, except the initial group
const deleteFilterGroup = async (
  groupId: string,
  initialGroupId: string,
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

    for (const subGroup of filterGroup.subGroups) {
      await deleteFilterGroup(subGroup.id, initialGroupId, tx);
    }

    if (groupId !== initialGroupId) {
      await tx.filterGroup.delete({
        where: { id: groupId },
      });
    }
  }
};

// func to create the parent group with all child groups
const createParentGroup = async (
  filterGroups: FilterConditionDTO[],
  tx: Prisma.TransactionClient,
) => {
  let lastGroup: {
    id: string;
    operator: FilterGroupOperator | null;
    filterConditionId: string | null;
    parentGroupId: string | null;
  } | null = null;
  let lastGroupOperation: FilterGroupOperator | undefined = undefined;

  for (const item of filterGroups) {
    // Create a filter condition
    const createdCondition = await tx.filterCondition.create({
      data: {
        attributeId: item.attributeId,
        operator: item.operator,
        value: item.value,
      },
    });

    // Create a filter group to the condition
    const createdGroup = await tx.filterGroup.create({
      data: {
        filterConditionId: createdCondition.id,
      },
    });

    if (lastGroupOperation && lastGroup) {
      // Create link group and update parentGroupId for createdGroup and lastGroup
      const linkGroup = await tx.filterGroup.create({
        data: {
          operator: lastGroupOperation,
        },
      });
      await tx.filterGroup.update({
        where: { id: createdGroup.id },
        data: { parentGroupId: linkGroup.id },
      });
      await tx.filterGroup.update({
        where: { id: lastGroup.id },
        data: { parentGroupId: linkGroup.id },
      });

      lastGroup = linkGroup;
    } else {
      lastGroup = createdGroup;
    }

    lastGroupOperation = item.operatorGroup ?? undefined;
  }

  return lastGroup;
};
