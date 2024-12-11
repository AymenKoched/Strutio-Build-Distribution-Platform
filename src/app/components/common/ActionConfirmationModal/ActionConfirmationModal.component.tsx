'use client';

import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import React from 'react';

export type ActionConfirmationModalProps = {
  trigger: JSX.Element;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ActionConfirmationModal = ({
  trigger,
  title,
  description,
  confirmText,
  onConfirm,
  isLoading,
}: ActionConfirmationModalProps) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button className={'cursor-pointer'} variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              className={'cursor-pointer'}
              onClick={onConfirm}
              loading={isLoading}
              variant="solid"
              color="red"
            >
              {confirmText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ActionConfirmationModal;
