'use client';

import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  IconButton,
  ScrollArea,
  TextField,
} from '@radix-ui/themes';
import { useFilters, useUrlParam } from '@strutio/app/hooks';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { FilterCard } from '../FilterCard';
import { FilterCardSkeleton } from '../FilterCardSkeleton';
import styles from './FilterList.module.scss';

export type FilterListProps = { className?: string };

export default function FilterList({ className }: FilterListProps) {
  const { getParam, updateParam, clearParam } = useUrlParam();
  const initialName = getParam('name') || '';

  const [searchInput, setSearchInput] = useState<string>(initialName);
  const [name] = useDebounceValue(searchInput, 500);

  useEffect(() => {
    if (name) {
      updateParam('name', name);
    } else {
      clearParam('name');
    }
  }, [name]);

  const { filters, isLoading } = useFilters(name);

  const filtersList = (
    <ScrollArea type="always" scrollbars="vertical" style={{ height: 600 }}>
      <div className={classNames(styles.container__list, 'pr-4 pb-3')}>
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
      size={'3'}
      radius={'medium'}
      placeholder={'Search filters by name'}
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
      <TextField.Slot side={'right'}>
        <IconButton
          className={styles.search_bar__clear_btn}
          size="2"
          variant="ghost"
          color="red"
          radius="full"
          onClick={() => setSearchInput('')}
        >
          <Cross1Icon height="16" width="16" />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );

  return (
    <Card className={classNames(className, styles.container)} size="4">
      <div className={styles.container__header}>
        <h1 className={styles.container__title}>Filters</h1>
        <Link href={'/filters/create'}>
          <Button className={styles.create_btn} size={'3'} variant={'soft'}>
            Create Filter
          </Button>
        </Link>
      </div>
      <p className={styles.container__desc}>
        Click on a filter to search the builds.
      </p>
      {searchBar}
      {isLoading ? (
        loader
      ) : isEmpty(filters) ? (
        name ? (
          <p>No filters found matching this name.</p>
        ) : (
          <p>No filters yet!</p>
        )
      ) : (
        filtersList
      )}
    </Card>
  );
}
