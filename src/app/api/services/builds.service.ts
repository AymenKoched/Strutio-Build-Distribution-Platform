import { FilterConditionOperator, Prisma } from '@prisma/client';
import { FilterGroupType } from '@strutio/models';
import BuildWhereInput = Prisma.BuildWhereInput;
import prisma from '@strutio/prisma/client';

import { getFilterDetails } from './filters.service';

export const getBuilds = async (filterId?: string) => {
  const filter = await getFilterDetails(filterId as string);

  if (!filterId || !filter) {
    return prisma.build.findMany({
      include: {
        AttributeBuilds: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  const query = createQuery(filter?.filterGroups);

  return prisma.build.findMany({
    where: query,
    include: {
      AttributeBuilds: {
        include: {
          attribute: true,
        },
      },
    },
  });
};

const createQuery = (filterGroups: FilterGroupType[]): BuildWhereInput => {
  if (filterGroups.length === 0) {
    return {};
  }

  let query: BuildWhereInput = {};

  const [item, item1, item2, ...remainingItems] = filterGroups;

  if (item?.operator) {
    const queryList: BuildWhereInput[] = [];
    let nextQuery: BuildWhereInput = {};

    if (!item1.operator && item1.filterCondition) {
      const operatorQueryKey = mapOperatorToQueryKey(
        item1.filterCondition.operator,
      );

      queryList.push({
        AttributeBuilds: {
          some: {
            attributeId: item1.filterCondition.attributeId,
            value: {
              [operatorQueryKey]: item1?.filterCondition?.value,
            },
          },
        },
      });
    } else {
      nextQuery = createQuery([item1, item2, ...remainingItems]);
      queryList.push(nextQuery);
    }

    if (!item2.operator && item2.filterCondition) {
      const operatorQueryKey = mapOperatorToQueryKey(
        item2.filterCondition.operator,
      );

      queryList.push({
        AttributeBuilds: {
          some: {
            attributeId: item2.filterCondition.attributeId,
            value: {
              [operatorQueryKey]: item2.filterCondition?.value,
            },
          },
        },
      });
    } else {
      nextQuery = createQuery([item2, ...remainingItems]);
      queryList.push(nextQuery);
    }

    if (item.operator === 'AND') {
      query.AND = queryList;
    } else if (item.operator === 'OR') {
      query.OR = queryList;
    }
  } else if (item.filterCondition) {
    const operatorQueryKey = mapOperatorToQueryKey(
      item.filterCondition.operator,
    );

    query = {
      AttributeBuilds: {
        some: {
          attributeId: item.filterCondition.attributeId,
          value: {
            [operatorQueryKey]: item.filterCondition.value,
          },
        },
      },
    };
  }

  return query;
};

const mapOperatorToQueryKey = (operator: FilterConditionOperator): string => {
  switch (operator) {
    case FilterConditionOperator.EQUALS:
      return 'equals';
    case FilterConditionOperator.NOT_EQUALS:
      return 'not';
    case FilterConditionOperator.GREATER_THAN:
      return 'gt';
    case FilterConditionOperator.GREATER_THAN_EQUALS:
      return 'gte';
    case FilterConditionOperator.LESS_THAN:
      return 'lt';
    case FilterConditionOperator.LESS_THAN_EQUALS:
      return 'lte';
    case FilterConditionOperator.CONTAINS:
      return 'contains';
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
};
