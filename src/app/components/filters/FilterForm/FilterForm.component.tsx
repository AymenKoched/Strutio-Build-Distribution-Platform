'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FilterConditionOperator } from '@prisma/client';
import { Button, Card, TextField } from '@radix-ui/themes';
import { ErrorMessage, FilterConditionInput } from '@strutio/app/components';
import { useCreateFilter } from '@strutio/app/hooks';
import { FilterConditionDTO, FilterDTO, filterSchema } from '@strutio/models';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import styles from './FilterForm.module.scss';

export type FilterFormProps = {
  className?: string;
};

const FilterForm = ({ className }: FilterFormProps) => {
  const router = useRouter();
  const { mutate, isLoading, isSuccess, data } = useCreateFilter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterDTO>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      filterGroups: [
        {
          attributeId: '',
          value: '',
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'filterGroups',
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  useEffect(() => {
    if (isSuccess && data?.id) {
      router.push(`/?filterId=${data.id}`);
    }
  }, [isSuccess, data]);

  const addCondition = useCallback(() => {
    append({
      attributeId: '',
      operator: FilterConditionOperator.EQUALS,
      value: '',
    });
  }, [append]);

  const updateCondition = useCallback(
    (index: number, updatedCondition: FilterConditionDTO) => {
      update(index, updatedCondition);
    },
    [update],
  );

  const removeCondition = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const resetFilters = useCallback(() => {
    reset({
      name: '',
      filterGroups: [
        {
          attributeId: '',
          value: '',
        },
      ],
    });
  }, [reset]);

  return (
    <Card className={classNames(className, styles.container)} size="4">
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="name" className={styles.form_group__label}>
            Filter Name:
          </label>
          <TextField.Root
            id={'name'}
            {...register('name')}
            placeholder={'put your filter name'}
            size={'3'}
            radius={'medium'}
          />
          {errors?.name?.message && (
            <ErrorMessage text={errors.name.message as string} />
          )}
        </div>

        <div className={styles.form_group}>
          <label htmlFor="filterGroups" className={styles.form_group__label}>
            Filter Conditions:
          </label>
          {errors?.filterGroups?.message && (
            <ErrorMessage text={errors.filterGroups.message as string} />
          )}
          <div className={styles.form_group__items}>
            <Controller
              control={control}
              name={'filterGroups'}
              render={() => (
                <>
                  {fields.map((condition, index) => (
                    <div key={index} className={styles.form_group__item}>
                      <FilterConditionInput
                        condition={condition}
                        onConditionChange={(updatedCondition) =>
                          updateCondition(index, updatedCondition)
                        }
                        onAddCondition={addCondition}
                        onRemoveCondition={() => removeCondition(index)}
                        hideRemove={index === 0}
                        hideAdd={index !== fields.length - 1}
                      />
                      <div className={styles.form_group__errors}>
                        {errors?.filterGroups?.[index]?.attributeId && (
                          <ErrorMessage
                            className={styles.form_group__error}
                            text={'Attribute is invalid'}
                          />
                        )}
                        {errors?.filterGroups?.[index]?.operator && (
                          <ErrorMessage
                            className={styles.form_group__error}
                            text={'Operator is invalid'}
                          />
                        )}
                        {errors?.filterGroups?.[index]?.value && (
                          <ErrorMessage
                            className={styles.form_group__error}
                            text={'Value is invalid'}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        <div className={styles.form__footer}>
          <Button
            className={styles.form__footer__icon}
            color="crimson"
            variant="soft"
            size="3"
            type={'button'}
            onClick={resetFilters}
          >
            Cancel
          </Button>
          <Button
            className={styles.form__footer__icon}
            color="indigo"
            variant="soft"
            size="3"
            type={'submit'}
            loading={isLoading}
          >
            Create
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FilterForm;
