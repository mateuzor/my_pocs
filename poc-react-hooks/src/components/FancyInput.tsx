import { forwardRef, useImperativeHandle, useRef } from 'react';

// Interface for methods we want to expose to parent
export interface FancyInputHandle {
  focus: () => void;
  clear: () => void;
  setValue: (value: string) => void;
  getValue: () => string;
}

interface Props {
  placeholder?: string;
}

// forwardRef allows parent to get ref to this component
// useImperativeHandle customizes what the ref exposes
const FancyInput = forwardRef<FancyInputHandle, Props>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose custom methods to parent via ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    setValue: (value: string) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    },
    getValue: () => {
      return inputRef.current?.value || '';
    }
  }));

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={props.placeholder}
      style={{
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #4CAF50',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    />
  );
});

FancyInput.displayName = 'FancyInput';

export default FancyInput;
