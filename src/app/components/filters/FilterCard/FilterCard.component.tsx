'use client';

import {
  Cross1Icon,
  DotsVerticalIcon,
  Pencil1Icon,
} from '@radix-ui/react-icons';
import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDeleteFilter, useUrlParam } from '@strutio/app/hooks';
import { FilterType } from '@strutio/models';
import { formatDate } from '@strutio/utils';
import classNames from 'classnames';

import styles from './FilterCard.module.scss';

export type FilterCardProps = {
  className?: string;
  filter: FilterType;
};

export default function FilterCard({ className, filter }: FilterCardProps) {
  const { getParam, updateParam, clearParam } = useUrlParam();
  const { mutate } = useDeleteFilter();

  const filterId = getParam('filterId');
  const isSelected = filterId === filter.id;

  const handleDelete = () => {
    mutate(filter.id);
  };

  const dropdownIcon = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          className={'cursor-pointer'}
          size={'1'}
          variant={'ghost'}
          color={'violet'}
        >
          <DotsVerticalIcon width={'16'} height={'16'} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className={'cursor-pointer'}>
          <div className={'flex w-full items-center justify-between gap-10'}>
            <p>Edit</p>
            <Pencil1Icon />
          </div>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          className={'cursor-pointer'}
          onClick={handleDelete}
          color="red"
        >
          <div className={'flex w-full items-center justify-between gap-10'}>
            <p>Delete</p>
            <Cross1Icon />
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  return (
    <div
      className={classNames(
        className,
        styles.filter_card,
        isSelected ? '!bg-violet-50' : '',
      )}
      onClick={() =>
        isSelected ? clearParam('filterId') : updateParam('filterId', filter.id)
      }
    >
      <div className={'flex flex-row items-start justify-between'}>
        <h2 className={styles.filter_card__title}>{filter.name}</h2>
        {dropdownIcon}
      </div>
      <p className={styles.filter_card__timestamp}>
        Created at: {formatDate(new Date(filter.createdAt))}
      </p>
    </div>
  );
}
