'use client';

import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Card, ScrollArea, TextField } from '@radix-ui/themes';
import { useFilters, useUrlParam } from '@strutio/app/hooks';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash';
import React, { useEffect } from 'react';

import { FilterCard } from '../FilterCard';
import { FilterCardSkeleton } from '../FilterCardSkeleton';
import styles from './FilterList.module.scss';

export type FilterListProps = { className?: string };

export default function FilterList({ className }: FilterListProps) {
  const { getParam, updateParam, clearParam } = useUrlParam();
  const name = getParam('name');

  useEffect(() => {
    if (name === '') clearParam('name');
  }, [clearParam, name]);

  const { filters, isLoading } = useFilters(name || undefined);

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

  const searchBar = (
    <TextField.Root
      className={styles.search_bar}
      placeholder={'Search filters by name'}
      value={name || ''}
      onChange={(e) => updateParam('name', e.target.value)}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
      <TextField.Slot
        side={'right'}
        className={styles.search_bar__close}
        onClick={() => clearParam('name')}
      >
        <Cross1Icon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );

  return (
    <Card className={classNames(className, styles.container)} size="4">
      <h1 className={styles.container__title}>Filters</h1>
      <p className={styles.container__desc}>
        Click on a filter to search the builds.
      </p>
      {searchBar}
      {isLoading ? (
        loader
      ) : isEmpty(filters) ? (
        <p>No filters yet!</p>
      ) : !filters ? (
        <p>No filters with this name!</p>
      ) : (
        filtersList
      )}
    </Card>
  );
}
