import { BuildsList, FilterList } from '@strutio/app/components';
import React from 'react';

import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <FilterList className={styles.filters_list} />
      <BuildsList className={styles.builds_list} />
    </div>
  );
}
