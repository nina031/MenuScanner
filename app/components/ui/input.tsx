import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '../../../src/lib/utils';

interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900',
          props.editable === false && 'opacity-50',
          className
        )}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
