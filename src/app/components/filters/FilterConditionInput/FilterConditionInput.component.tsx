'use client';

import { FilterConditionOperator, FilterGroupOperator } from '@prisma/client';
import { Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout, Select, TextField } from '@radix-ui/themes';
import { useAttributes } from '@strutio/app/hooks';
import { FilterConditionDTO } from '@strutio/models';
import { getOperatorLabel, getOperatorsForType } from '@strutio/utils';
import classNames from 'classnames';
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';

import styles from './FormConditionInput.module.scss';

export type FilterConditionInputProps = {
  className?: string;
  condition: FilterConditionDTO;
  onConditionChange: (updatedCondition: FilterConditionDTO) => void;
  onAddCondition: () => void;
  onRemoveCondition: () => void;
  isRemovable: boolean;
  isLastCondition: boolean;
};

const FilterConditionInput = ({
  className,
  condition,
  onConditionChange,
  onAddCondition,
  onRemoveCondition,
  isRemovable,
  isLastCondition,
}: FilterConditionInputProps) => {
  const { attributes, isLoading: attributesLoading } = useAttributes();

  const selectedAttribute = useMemo(() => {
    return condition?.attributeId
      ? attributes?.find((attribute) => attribute.id === condition.attributeId)
      : undefined;
  }, [attributes, condition?.attributeId]);

  const handleAttributeChange = useCallback(
    (value: string) => {
      onConditionChange({
        ...condition,
        attributeId: value,
      });
    },
    [onConditionChange],
  );

  const handleOperatorChange = useCallback(
    (value: string) => {
      if (condition) {
        onConditionChange({
          ...condition,
          operator: value as FilterConditionOperator,
          value: '',
        });
      }
    },
    [condition, onConditionChange],
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (condition) {
        onConditionChange({
          ...condition,
          value: e.target.value,
        });
      }
    },
    [condition, onConditionChange, selectedAttribute],
  );

  const handleOperatorGroupChange = useCallback(
    (value: string) => {
      if (condition) {
        onConditionChange({
          ...condition,
          operatorGroup: value as FilterGroupOperator,
        });
        if (isLastCondition) {
          onAddCondition();
        }
      }
    },
    [condition, isLastCondition, onConditionChange, onAddCondition],
  );

  return (
    <div className={classNames(className, styles.condition)}>
      <div className={styles.condition__items}>
        <Select.Root
          value={condition?.attributeId}
          onValueChange={handleAttributeChange}
          size="3"
        >
          <Select.Trigger
            className={styles.condition__item}
            placeholder="Select Attribute"
            radius="large"
          />
          <Select.Content position="popper">
            {attributesLoading ? (
              <Select.Item value="loading" disabled>
                Loading...
              </Select.Item>
            ) : (
              attributes?.map((attribute) => (
                <Select.Item key={attribute.id} value={attribute.id}>
                  {attribute.name}
                </Select.Item>
              ))
            )}
          </Select.Content>
        </Select.Root>

        <Select.Root
          disabled={!condition?.attributeId}
          value={condition?.operator}
          onValueChange={handleOperatorChange}
          size="3"
        >
          <Select.Trigger
            className={styles.condition__item}
            placeholder="Select Operator"
            radius="large"
          />
          <Select.Content position="popper">
            {selectedAttribute ? (
              map(getOperatorsForType(selectedAttribute.type), (operator) => (
                <Select.Item
                  key={operator}
                  className="flex justify-center"
                  value={operator}
                >
                  {getOperatorLabel(operator)}
                </Select.Item>
              ))
            ) : (
              <Select.Item value="no-operator" disabled>
                Select an attribute first
              </Select.Item>
            )}
          </Select.Content>
        </Select.Root>

        <TextField.Root
          className={styles.condition__item}
          disabled={!condition?.attributeId || !condition?.operator}
          value={condition?.value || ''}
          onChange={handleValueChange}
          placeholder="Enter condition value"
          size="3"
          radius="large"
        />
      </div>

      <div className={styles.condition__footer}>
        <Select.Root
          disabled={!condition}
          value={condition?.operatorGroup}
          onValueChange={handleOperatorGroupChange}
          size="3"
        >
          <Select.Trigger
            className={styles.condition__operator_group_selector}
            placeholder="Select link operator"
            radius="large"
          />
          <Select.Content position="popper">
            {map(FilterGroupOperator, (operator) => (
              <Select.Item
                key={operator}
                className="flex justify-center"
                value={operator}
              >
                {operator}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Callout.Root className="w-full" size="1" variant="surface">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            This operator links all the previous conditions with the next
            condition.
          </Callout.Text>
        </Callout.Root>
      </div>

      {isRemovable && (
        <div
          className={styles.condition__delete_condition_button}
          onClick={onRemoveCondition}
        >
          Remove Condition <Cross1Icon />
        </div>
      )}
    </div>
  );
};

export default FilterConditionInput;
