'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FilterConditionOperator } from '@prisma/client';
import { Button, Card, TextField } from '@radix-ui/themes';
import { ErrorMessage, FilterConditionInput } from '@strutio/app/components';
import { FilterConditionDTO, filterSchema } from '@strutio/models';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import styles from './FilterForm.module.scss';

export type FilterFormProps = {
  className?: string;
};

type FilterFormData = z.infer<typeof filterSchema>;

const FilterForm = ({ className }: FilterFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FilterFormData>({
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

  console.log({ values: getValues() });
  console.log({ errors });

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

  return (
    <Card className={classNames(className, styles.container)} size="4">
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => {
          console.log({ data });
        })}
      >
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
                        isRemovable={index !== 0}
                        isLastCondition={index === fields.length - 1}
                      />
                      <div className={styles.form_group__errors}>
                        {errors?.filterGroups?.[index]?.attributeId && (
                          <ErrorMessage
                            className={styles.form_group__error}
                            text={
                              errors.filterGroups[index].attributeId
                                .message as string
                            }
                          />
                        )}
                        {errors?.filterGroups?.[index]?.operator && (
                          <ErrorMessage
                            className={styles.form_group__error}
                            text={
                              errors.filterGroups[index].operator
                                .message as string
                            }
                          />
                        )}
                        {errors?.filterGroups?.[index]?.value && (
                          <ErrorMessage
                            className={styles.form_group__error}
                            text={
                              errors.filterGroups[index].value.message as string
                            }
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
            type={'reset'}
          >
            Cancel
          </Button>
          <Button
            className={styles.form__footer__icon}
            color="indigo"
            variant="soft"
            size="3"
            type={'submit'}
          >
            Create
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FilterForm;
