import { Avatar } from '@radix-ui/themes';
import { BuildType } from '@strutio/models';
import classNames from 'classnames';
import React from 'react';

import styles from './BuildCard.module.scss';

function formatDate(date: Date): string {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export type BuildCardProps = {
  className?: string;
  build: BuildType;
};

export default function BuildCard({ className, build }: BuildCardProps) {
  return (
    <div className={classNames(className, styles.build_card)}>
      <div className={styles.build_card__header}>
        <div className={styles.build_card__avatar}>
          <Avatar
            size="3"
            src="/strutio_logo.jpeg"
            fallback="S"
            alt="Strutio Build"
          />
          <h2 className={styles.build_card__title}>{build.name}</h2>
        </div>
        <p className={styles.build_card__timestamp}>
          {formatDate(new Date(build.timestamp))}
        </p>
      </div>
      <div className={styles.build_card__attributes}>
        {build.AttributeBuilds.map(({ attribute, value }) => (
          <div
            key={attribute.id}
            className={styles.build_card__attributes__item}
          >
            <span className={styles.build_card__attributes__item__name}>
              {attribute.name}
            </span>
            <span className={styles.build_card__attributes__item__value}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
