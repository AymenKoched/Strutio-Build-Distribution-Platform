import prisma from '@strutio/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filterId = searchParams.get('filterId');
    console.log({ filterId });

    const builds = await prisma.build.findMany({
      include: {
        AttributeBuilds: {
          include: {
            attribute: true,
          },
        },
      },
    });

    return NextResponse.json({ builds }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
