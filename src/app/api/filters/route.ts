import { FilterDTO, filterSchema } from '@strutio/models';
import { NextRequest, NextResponse } from 'next/server';

import { createFilter, getFilters } from '../services';

export const GET = async (request: NextRequest) => {
  try {
    const name = request.nextUrl.searchParams.get('name');

    const filters = await getFilters(name || undefined);

    return NextResponse.json(filters, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
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

    const filter = await createFilter({ name, filterGroups });

    return NextResponse.json(filter, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
