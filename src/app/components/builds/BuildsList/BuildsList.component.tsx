'use client';

import { Card } from '@radix-ui/themes';
import { useBuilds, useUrlParam } from '@strutio/app/hooks';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash';
import React, { useMemo } from 'react';

import { BuildCard } from '../BuildCard';
import { BuildCardSkeleton } from '../BuildCardSkeleton';
import styles from './BuildsList.module.scss';

export type BuildsListProps = { className?: string };

export default function BuildsList({ className }: BuildsListProps) {
  const { getParam } = useUrlParam();
  const filterId = getParam('filterId');

  const { builds, isLoading } = useBuilds(filterId || undefined);

  const buildsCount = useMemo(() => builds?.length || 0, [builds]);

  const buildList = (
    <div className={styles.container__list}>
      {map(builds, (build) => (
        <BuildCard key={build.id} build={build} />
      ))}
    </div>
  );

  const loader = (
    <div className={styles.container__list}>
      {[...new Array(5)].map((_, index) => (
        <BuildCardSkeleton key={index} />
      ))}
    </div>
  );

  return (
    <Card className={classNames(className, styles.container)} size="4">
      <h1 className={styles.container__title}>Builds</h1>
      <div className={styles.container__desc}>
        <p>Review recent builds.</p>
        <p>
          {buildsCount} {buildsCount === 1 ? 'build' : 'builds'} found
        </p>
      </div>
      {isLoading ? (
        loader
      ) : isEmpty(builds) ? (
        filterId ? (
          <p>No builds found matching this filter.</p>
        ) : (
          <p>No builds yet!</p>
        )
      ) : (
        buildList
      )}
    </Card>
  );
}
