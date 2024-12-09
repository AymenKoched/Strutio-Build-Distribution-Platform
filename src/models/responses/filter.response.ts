import { $Enums } from '@prisma/client';

import { AttributeType } from './build.response';

export type FilterGroupType = {
  id: string;
  operator?: $Enums.FilterGroupOperator;
  parentGroupId?: string;
  filterConditionId?: string;
  filterCondition?: FilterConditionType;
};

export type FilterConditionType = {
  id: string;
  attributeId: string;
  operator: $Enums.FilterConditionOperator;
  value: string;
  attribute: AttributeType;
};
