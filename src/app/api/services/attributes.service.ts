import { AttributeType } from '@strutio/models';
import prisma from '@strutio/prisma/client';

export const getAttributes = async (): Promise<AttributeType[]> => {
  return prisma.attribute.findMany();
};
