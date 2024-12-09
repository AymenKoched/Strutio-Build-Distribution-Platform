import { Skeleton } from '@radix-ui/themes';
import classNames from 'classnames';
import React from 'react';

export default function BuildCardSkeleton({
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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
