import { $Enums } from '.prisma/client';
import FilterGroupOperator = $Enums.FilterGroupOperator;
import FilterConditionOperator = $Enums.FilterConditionOperator;
import { z } from 'zod';

export type FilterConditionDTO = {
  operatorGroup?: FilterGroupOperator;
  attributeId: string;
  operator: FilterConditionOperator;
  value: string;
};

export const filterConditionSchema = z.object({
  operatorGroup: z
    .enum(Object.values(FilterGroupOperator) as [FilterGroupOperator])
    .optional(),
  attributeId: z.string().min(1, 'attributeId is required'),
  operator: z.enum(
    Object.values(FilterConditionOperator) as [FilterConditionOperator],
  ),
  value: z.string().min(1, 'value is required'),
});

export type FilterDTO = {
  name: string;
  filterGroups: FilterConditionDTO[];
};

export const filterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  filterGroups: z
    .array(filterConditionSchema)
    .min(1, 'At least one filter group is required'),
});
