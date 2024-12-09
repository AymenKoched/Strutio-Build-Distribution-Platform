import { type NextRequest, NextResponse } from 'next/server';

import { getBuilds } from '../services';

export const GET = async (request: NextRequest) => {
  try {
    const filterId = request.nextUrl.searchParams.get('filterId');

    const builds = await getBuilds(filterId || undefined);

    return NextResponse.json(builds, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
