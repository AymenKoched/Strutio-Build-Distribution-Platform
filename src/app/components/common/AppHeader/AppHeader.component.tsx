import { Avatar } from '@radix-ui/themes';
import classNames from 'classnames';
import React from 'react';

import styles from './AppHeader.module.scss';

export default function AppHeader({ className }: AppHeaderProps) {
  return (
    <header className={classNames(styles.header, className)}>
      <div className={styles.header__container}>
        <div className={styles.img_wrapper}>
          <Avatar
            className={'transition-all'}
            src="/strutio_logo.jpeg"
            size={'4'}
            radius={'full'}
            fallback={'Strutio'}
          />
          <h1 className={styles.img_wrapper__name}>
            Strutio - Filtering System
          </h1>
        </div>
      </div>
    </header>
  );
}

export type AppHeaderProps = {
  className?: string;
};
