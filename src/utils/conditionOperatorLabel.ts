import { FilterConditionOperator } from '@prisma/client';

export const getOperatorLabel = (operator: FilterConditionOperator): string => {
  switch (operator) {
    case FilterConditionOperator.EQUALS:
      return '=';
    case FilterConditionOperator.NOT_EQUALS:
      return '!=';
    case FilterConditionOperator.GREATER_THAN:
      return 'Greater than >';
    case FilterConditionOperator.GREATER_THAN_EQUALS:
      return 'Greater than equals >=';
    case FilterConditionOperator.LESS_THAN:
      return 'Less than <';
    case FilterConditionOperator.LESS_THAN_EQUALS:
      return 'Less than equals <=';
    case FilterConditionOperator.CONTAINS:
      return 'Contains';
    default:
      return operator as string;
  }
};
