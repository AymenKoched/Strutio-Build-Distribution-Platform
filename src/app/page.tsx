import { BuildsList } from '@strutio/app/components';
import React from 'react';

import styles from './page.module.scss';

export default async function Home() {
  return (
    <div className={styles.container}>
      <BuildsList className={styles.flexible_builds_list} />
      <BuildsList className={styles.builds_list} />
    </div>
  );
}
