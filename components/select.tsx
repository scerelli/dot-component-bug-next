'use client'
import { createContext, forwardRef, useCallback, useContext } from 'react'
import type { FC, ReactElement, ReactNode } from 'react'
import * as RadixSelect from '@radix-ui/react-select'


export type SelectContext = {
  size: SelectSizes
}

type SelectLabelProps = RadixSelect.SelectLabelProps
const SelectLabel: FC<SelectLabelProps> = (props) => {
  return (
    <RadixSelect.Label {...props} asChild>
      <label>
        {props.children}
      </label>
    </RadixSelect.Label>
  )
}

type SelectGroupProps = RadixSelect.SelectGroupProps
const SelectGroup: FC<SelectGroupProps> = ({ className, ...props }) => {
  return (
    <RadixSelect.Group {...props} />
  )
}

export interface SelectComponent extends React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement> & SelectProps> {
  Item: React.FC<SelectItemProps>
  Group: React.FC<SelectGroupProps>
  Label: React.FC<SelectLabelProps>
}

export enum SelectSizes {
  lg = 'lg',
  md = 'md',
  sm = 'sm'
}

export interface SelectProps extends Omit<RadixSelect.SelectTriggerProps, 'onChange' | 'value' | 'defaultValue' > {
  trigger?: ReactNode
  className?: string
  children: ReactElement<typeof Item> | ReactElement<typeof Item>[]
  size?: keyof typeof SelectSizes
  placeholder?: string
  triggerProps?: RadixSelect.SelectTriggerProps
  errorMessage?: string
  label?: string
  onChange?: (value: string | undefined) => void
  value?: string
  defaultValue?: string
}

export type SelectItemProps = any
const Item: FC<SelectItemProps> = ({ children, icon, disabled, iconPosition, ...otherProps }) => {
  return (
    <RadixSelect.Item {...otherProps}>
      <div>
        <div>
          <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
          <RadixSelect.ItemIndicator>
            icon
          </RadixSelect.ItemIndicator>
        </div>
      </div>
    </RadixSelect.Item>
  )
}

const SelectBase = forwardRef<HTMLButtonElement, SelectProps>(({
  className,
  trigger,
  children,
  size = SelectSizes.md,
  errorMessage,
  label,
  id,
  placeholder,
  onChange,
  value,
  defaultValue,
  ...props
}, forwardedRef) => {

  const handleChange = useCallback((value: string) => {
    if(!props.disabled && onChange) onChange(value)
  }, [props.disabled, onChange])

  return (
    <RadixSelect.Root onValueChange={handleChange} value={value} defaultValue={defaultValue} >
      <div>
        {label
        ? (
          <label
            htmlFor={id}
            aria-label={props['aria-label'] ? props['aria-label'] : label}
          >
            {label}
          </label>
          )
        : null}
          <RadixSelect.Trigger
            id={id}
            ref={forwardedRef}
            data-trigger-size={size}
            data-trigger-error={Boolean(errorMessage)}
            data-trigger-disabled={props.disabled}
            aria-label={props['aria-label'] ? props['aria-label'] : label}
            {...props}
          >
              <span>
                <RadixSelect.Value placeholder={placeholder} />
              </span>
              <RadixSelect.Icon>
                icon
              </RadixSelect.Icon>
          </RadixSelect.Trigger>
          {errorMessage
          ? (
            <span
              data-text-size={size}
            >
              {errorMessage}
            </span>
            )
          : null}
          </div>
        <RadixSelect.Portal>
          <RadixSelect.Content position='popper'>
            <RadixSelect.ScrollUpButton>
              up
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport>
              {children}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton>
              down
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
  )
})

SelectBase.displayName = 'SelectBase'

export const Select = SelectBase as any as SelectComponent

Select.Item = Item
Select.Label = SelectLabel
Select.Group = SelectGroup

Select.displayName = 'Select'
