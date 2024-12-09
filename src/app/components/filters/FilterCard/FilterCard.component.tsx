import { FilterType } from '@strutio/models';
import { formatDate } from '@strutio/utils';
import classNames from 'classnames';

import styles from './FilterCard.module.scss';

export type FilterCardProps = {
  className?: string;
  filter: FilterType;
};

export default function FilterCard({ className, filter }: FilterCardProps) {
  return (
    <div className={classNames(className, styles.filter_card)}>
      <h2 className={styles.filter_card__title}>{filter.name}</h2>
      <div className={styles.filter_card__timestamps}>
        <p className={styles.filter_card__timestamp}>
          Created at: {formatDate(new Date(filter.createdAt))}
        </p>
      </div>
    </div>
  );
}
