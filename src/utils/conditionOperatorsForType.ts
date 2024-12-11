import { AttributeType, FilterConditionOperator } from '@prisma/client';

export const getOperatorsForType = (
  attributeType: keyof typeof AttributeType,
): FilterConditionOperator[] => {
  switch (attributeType) {
    case 'string':
      return [
        FilterConditionOperator.EQUALS,
        FilterConditionOperator.NOT_EQUALS,
        FilterConditionOperator.CONTAINS,
      ];
    case 'number':
      return [
        FilterConditionOperator.EQUALS,
        FilterConditionOperator.NOT_EQUALS,
        FilterConditionOperator.GREATER_THAN,
        FilterConditionOperator.GREATER_THAN_EQUALS,
        FilterConditionOperator.LESS_THAN,
        FilterConditionOperator.LESS_THAN_EQUALS,
      ];
    case 'boolean':
      return [
        FilterConditionOperator.EQUALS,
        FilterConditionOperator.NOT_EQUALS,
      ];
    case 'date':
      return [
        FilterConditionOperator.EQUALS,
        FilterConditionOperator.NOT_EQUALS,
        FilterConditionOperator.GREATER_THAN,
        FilterConditionOperator.LESS_THAN,
      ];
    default:
      return [];
  }
};
