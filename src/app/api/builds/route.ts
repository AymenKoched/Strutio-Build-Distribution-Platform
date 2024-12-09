import { type NextRequest, NextResponse } from 'next/server';

import { getBuilds } from '../services';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filterId = searchParams.get('filterId');

    const builds = await getBuilds(filterId as string);

    return NextResponse.json(builds, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
