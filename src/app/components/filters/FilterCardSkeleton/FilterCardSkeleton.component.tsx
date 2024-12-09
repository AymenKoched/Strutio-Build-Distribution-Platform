import { Skeleton } from '@radix-ui/themes';
import classNames from 'classnames';
import React from 'react';

export default function FilterCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={classNames(
        className,
        'rounded-lg border border-gray-200 bg-white p-4 shadow-md w-full',
      )}
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>
    </div>
  );
}
