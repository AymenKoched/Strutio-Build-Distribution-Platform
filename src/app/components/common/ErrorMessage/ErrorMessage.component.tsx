import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';
import React from 'react';

export type ErrorMessageProps = {
  className?: string;
  text: string;
};

const ErrorMessage = ({ className, text }: ErrorMessageProps) => {
  return (
    <Callout.Root className={className} color="red" role="alert" size="1">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>{text}</Callout.Text>
    </Callout.Root>
  );
};

export default ErrorMessage;
