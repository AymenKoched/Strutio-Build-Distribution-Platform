import React from 'react';

import EditPage from './EditPage.component';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFilter({ params }: Props) {
  const filterId = (await params).id;

  return <EditPage filterId={filterId} />;
}
