import { $Enums } from '@prisma/client';

export type BuildType = {
  id: string;
  name: string;
  timestamp: Date;
  AttributeBuilds: AttributeBuildType[];
};

export type AttributeBuildType = {
  buildId: string;
  attributeId: string;
  value: string;
  attribute: AttributeType;
};

export type AttributeType = {
  id: string;
  name: string;
  type: $Enums.AttributeType;
};
