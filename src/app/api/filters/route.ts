import { FilterDTO, filterSchema } from '@strutio/models';
import prisma from '@strutio/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { $Enums } from '.prisma/client';
import FilterGroupOperator = $Enums.FilterGroupOperator;

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const parsedBody = filterSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors.map((e) => e.message).join(', ') },
        { status: 400 },
      );
    }

    const { name, filterGroups }: FilterDTO = parsedBody.data;

    let lastGroup: {
      id: string;
      operator: $Enums.FilterGroupOperator | null;
      filterConditionId: string | null;
      parentGroupId: string | null;
    } | null = null;
    let lastGroupOperation: FilterGroupOperator | undefined = undefined;

    const filter = await prisma.$transaction(async (tx) => {
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

      if (!lastGroup) {
        throw new Error('Unable to create filter, lastGroup is null.');
      }

      return tx.filter.create({
        data: {
          name,
          filterGroupId: lastGroup.id,
        },
      });
    });

    return NextResponse.json({ filter }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
