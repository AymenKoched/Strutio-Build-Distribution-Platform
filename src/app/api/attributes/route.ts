import { NextResponse } from 'next/server';

import { getAttributes } from '../services';

export const GET = async () => {
  try {
    const attributes = await getAttributes();

    return NextResponse.json(attributes, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
