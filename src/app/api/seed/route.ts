import prisma from '@strutio/prisma/client';
import { NextResponse } from 'next/server';

const builds = [
  {
    id: 'aa81d452-e1c9-41e1-914e-aaf286901e93',
    name: 'iOS Build for Release',
    attributes: {
      platform: 'iOS',
      version: '2.1.9',
      testCoverage: 85.5,
      isProduction: true,
      gitBranch: 'release/2.1.9',
    },
  },
  {
    id: '28513b50-0975-4321-b2c0-b794c2dd5b2d',
    name: 'iOS Build for Sprint',
    attributes: {
      platform: 'iOS',
      version: '3.1.1',
      testCoverage: 75.2,
      isProduction: false,
      gitBranch: 'sprints/sprint_3.1',
    },
  },
  {
    id: 'aef9f02a-ad6c-4d04-a590-411ad2bd6849',
    name: 'Android Build for QA Test',
    attributes: {
      platform: 'Android',
      version: '2.1.8',
      testCoverage: 75.5,
      isProduction: false,
      gitBranch: 'sprints/sprint_2.1_qa',
    },
  },
  {
    id: '96d8c3a9-3498-45ce-ae53-0a429dfe7c6c',
    name: 'Android Build for Security Test',
    attributes: {
      platform: 'Android',
      version: '4.1.5',
      testCoverage: 90.0,
      isProduction: true,
      gitBranch: 'security/security_audit_dec_2024',
    },
  },
];

export const POST = async () => {
  try {
    for (const build of builds) {
      const createdBuild = await prisma.build.create({
        data: {
          id: build.id,
          name: build.name,
        },
      });

      for (const [key, value] of Object.entries(build.attributes)) {
        let attribute = await prisma.attribute.findUnique({
          where: { name: key },
        });

        if (!attribute) {
          attribute = await prisma.attribute.create({
            data: {
              name: key,
              type:
                typeof value === 'number'
                  ? 'number'
                  : typeof value === 'boolean'
                  ? 'boolean'
                  : 'string',
            },
          });
        }

        await prisma.attributeBuild.create({
          data: {
            buildId: createdBuild.id,
            attributeId: attribute.id,
            value: value.toString(),
          },
        });
      }
    }

    return NextResponse.json(
      { message: 'Database seeded successfully!' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Failed to seed database.', error },
      { status: 500 },
    );
  }
};
