import React from 'react';

import EditFilterPage from './EditFilterPage.component';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFilter({ params }: Props) {
  const filterId = (await params).id;

  return <EditFilterPage filterId={filterId} />;
}
