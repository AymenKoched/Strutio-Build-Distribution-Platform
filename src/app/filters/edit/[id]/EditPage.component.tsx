'use client';

import { Spinner } from '@radix-ui/themes';
import { FilterForm } from '@strutio/app/components';
import { useFilter } from '@strutio/app/hooks';
import { transformFilter } from '@strutio/utils';
import React from 'react';

import styles from './page.module.scss';

export type EditPageProps = { filterId: string };

const EditPage = ({ filterId }: EditPageProps) => {
  const { filter, isLoading } = useFilter(filterId);

  return (
    <div className={styles.container}>
      <h1 className={styles.container__title}>Edit Filter</h1>
      {isLoading ? (
        <div className={styles.container__spinner_wrapper}>
          <Spinner />
        </div>
      ) : filter ? (
        <FilterForm
          className={styles.container__form}
          filterId={filterId}
          filter={transformFilter(filter)}
        />
      ) : null}
    </div>
  );
};

export default EditPage;
