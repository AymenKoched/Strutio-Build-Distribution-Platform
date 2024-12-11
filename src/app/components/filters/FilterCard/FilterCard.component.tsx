'use client';

import {
  Cross1Icon,
  DotsVerticalIcon,
  Pencil1Icon,
} from '@radix-ui/react-icons';
import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { ActionConfirmationModal } from '@strutio/app/components';
import { useDeleteFilter, useUrlParam } from '@strutio/app/hooks';
import { FilterType } from '@strutio/models';
import { formatDate } from '@strutio/utils';
import classNames from 'classnames';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

import styles from './FilterCard.module.scss';

export type FilterCardProps = {
  className?: string;
  filter: FilterType;
};

export default function FilterCard({ className, filter }: FilterCardProps) {
  const { getParam, updateParam, clearParam } = useUrlParam();
  const { mutate, isLoading: deleteLoading } = useDeleteFilter();

  const filterId = getParam('filterId');
  const isSelected = useMemo(
    () => filterId === filter.id,
    [filter.id, filterId],
  );

  const handleDelete = () => {
    if (getParam('filterId')) {
      clearParam('filterId');
    }
    mutate(filter.id);
  };

  const deleteTrigger = (
    <DropdownMenu.Item
      className={'cursor-pointer'}
      onSelect={(e) => e.preventDefault()}
      color="red"
    >
      <div className={'flex w-full items-center justify-between gap-10'}>
        <p>Delete</p>
        <Cross1Icon />
      </div>
    </DropdownMenu.Item>
  );

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

      <DropdownMenu.Content onClick={(e) => e.stopPropagation()}>
        <Link href={`/filters/edit/${filter.id}`}>
          <DropdownMenu.Item className={'cursor-pointer'}>
            <div className={'flex w-full items-center justify-between gap-10'}>
              <p>Edit</p>
              <Pencil1Icon />
            </div>
          </DropdownMenu.Item>
        </Link>

        <DropdownMenu.Separator />

        <ActionConfirmationModal
          trigger={deleteTrigger}
          title={'Delete Filter'}
          description={'Are you sure? This filter will be deleted.'}
          confirmText={'Delete'}
          onConfirm={handleDelete}
          isLoading={deleteLoading}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  const handleCardClick = useCallback(
    () =>
      isSelected ? clearParam('filterId') : updateParam('filterId', filter.id),
    [filter.id, isSelected],
  );

  return (
    <div
      className={classNames(
        className,
        styles.filter_card,
        isSelected ? '!bg-violet-50' : '',
      )}
      onClick={handleCardClick}
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
