'use client';

import { Card, ScrollArea } from '@radix-ui/themes';
import { useFilters } from '@strutio/app/hooks';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash';
import React from 'react';

import { FilterCard } from '../FilterCard';
import { FilterCardSkeleton } from '../FilterCardSkeleton';
import styles from './FilterList.module.scss';

export type FilterListProps = { className?: string };

export default function FilterList({ className }: FilterListProps) {
  const { filters, isLoading } = useFilters();

  const filtersList = (
    <ScrollArea type="always" scrollbars="vertical" style={{ height: 600 }}>
      <div className={styles.container__list}>
        {map(filters, (filter) => (
          <FilterCard key={filter.id} filter={filter} />
        ))}
      </div>
    </ScrollArea>
  );

  const loader = (
    <div className={styles.container__list}>
      {[...new Array(4)].map((_, index) => (
        <FilterCardSkeleton key={index} />
      ))}
    </div>
  );

  return (
    <Card className={classNames(className, styles.container)} size="4">
      <h1 className={styles.container__title}>Filters</h1>
      <p className={styles.container__desc}>
        Click on a filter to search the builds.
      </p>
      {isLoading ? (
        loader
      ) : isEmpty(filtersList) ? (
        <p>No filters yet!</p>
      ) : (
        filtersList
      )}
    </Card>
  );
}
