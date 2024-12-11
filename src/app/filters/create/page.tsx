import { FilterForm } from '@strutio/app/components';
import React from 'react';

import styles from './page.module.scss';

export default function CreateFilter() {
  return (
    <div className={styles.container}>
      <h1 className={styles.container__title}>Create Filter</h1>
      <FilterForm className={styles.container__form} />
    </div>
  );
}
