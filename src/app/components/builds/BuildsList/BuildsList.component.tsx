'use client';

import { Card } from '@radix-ui/themes';
import { useBuilds } from '@strutio/app/hooks';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash';
import React from 'react';

import { BuildCard } from '../BuildCard';
import { BuildCardSkeleton } from '../BuildCardSkeleton';
import styles from './BuildsList.module.scss';

export type BuildsListProps = { className?: string };

export default function BuildsList({ className }: BuildsListProps) {
  const { builds, isLoading } = useBuilds();

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
      <p className={styles.container__desc}>Review recent builds.</p>
      {isLoading ? loader : isEmpty(builds) ? <p>No builds yet!</p> : buildList}
    </Card>
  );
}
