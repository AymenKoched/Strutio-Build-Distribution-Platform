import { FilterDTO, filterSchema } from '@strutio/models';
import { NextRequest, NextResponse } from 'next/server';

import { deleteFilter, getFilterDetails, updateFilter } from '../../services';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const result = await getFilterDetails(id);

    return NextResponse.json(result, { status: 200 });
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
    await deleteFilter(id);

    return NextResponse.json(
      { message: 'Filter and related groups deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const body = await request.json();

    const parsedBody = filterSchema.safeParse(body);
    if (!parsedBody.success) {
      const error = parsedBody.error.errors.reduce(
        (acc: Record<string, string>, error) => {
          const path = error.path.join('.');
          acc[path] = error.message;
          return acc;
        },
        {},
      );

      return NextResponse.json({ error }, { status: 400 });
    }
    const { name, filterGroups }: FilterDTO = parsedBody.data;

    const updatedFilter = await updateFilter(id, { name, filterGroups });

    return NextResponse.json(updatedFilter, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
