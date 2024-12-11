import { FilterGroupOperator } from '@prisma/client';
import {
  FilterConditionDTO,
  FilterDTO,
  FilterGroupType,
  FilterType,
} from '@strutio/models';
import { map } from 'lodash';

export const transformFilter = (input: {
  filter: FilterType;
  filterGroups: FilterGroupType[];
}): FilterDTO => {
  const { filter, filterGroups } = input;

  const linkGroupsOperators: FilterGroupOperator[] = map(
    filterGroups,
    (filterGroup) => filterGroup.operator,
  )
    .filter((operator): operator is FilterGroupOperator => !!operator)
    .reverse();
  let i = 0;

  const transformedGroups: FilterConditionDTO[] = [];
  for (const group of [...filterGroups].reverse()) {
    if (group.operator) {
      continue;
    }

    let item: FilterConditionDTO;
    if (group.filterCondition) {
      const operatorGroup =
        i < linkGroupsOperators.length ? linkGroupsOperators[i] : undefined;
      i++;

      item = {
        operatorGroup,
        attributeId: group.filterCondition.attributeId,
        operator: group.filterCondition.operator,
        value: group.filterCondition.value,
      };

      transformedGroups.push(item);
    }
  }

  return {
    name: filter.name,
    filterGroups: transformedGroups,
  };
};
