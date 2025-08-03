import styled from "@emotion/styled"
import { FC, InputHTMLAttributes, PropsWithChildren, useCallback, useEffect, useState } from "react"

const CheckboxContainer = styled.div<{ isChecked: boolean; disabled?: boolean }>`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;

  ${({ isChecked }) =>
    isChecked &&
    `
    background-color: #0078d4;
    border-color: #0078d4;
  `}

  ${({ disabled }) =>
    disabled &&
    `
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f0f0f0 !important;
    border-color: #d0d0d0 !important;
  `}
  
  border: 1px solid #807e7e;
  margin: 0.5rem;
`

const CheckboxInput = styled.input`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
`

const Checked = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  pointer-events: none;
`

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "style" | "onChange"> & {
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    value: any,
  ) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const BaseCheckbox: FC<PropsWithChildren<CheckboxProps>> = ({
  defaultChecked,
  children,
  disabled,
  onChange,
  onKeyDown,
  value,
  ...rest
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked || false)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setIsChecked((prev) => {
          return !prev
        })
        if (!isChecked) {
          onChange?.(e, value)
        }

        onKeyDown?.(e)
      }
    },
    [onKeyDown],
  )

  useEffect(() => {
    setIsChecked(defaultChecked || false)
  }, [defaultChecked])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked
      setIsChecked(newValue)
      onChange?.(e, value)
    },
    [onChange, value],
  )

  return (
    <CheckboxContainer
      {...rest}
      aria-role="checkbox"
      aria-checked={isChecked}
      aria-readonly={disabled}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      isChecked={isChecked}
    >
      <CheckboxInput type="checkbox" disabled={disabled} value={value} defaultChecked={isChecked} />
      {isChecked && <Checked>{children}</Checked>}
    </CheckboxContainer>
  )
}

const Checkbox: FC<CheckboxProps> = ({
  checked,
  disabled,
  onChange,
  onKeyDown,
  value,
  ...rest
}) => {
  return (
    <BaseCheckbox
      defaultChecked={checked}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      {...rest}
    >
      {"✓"}
    </BaseCheckbox>
  )
}
const IndeterminateCheckbox: FC<CheckboxProps> = ({
  checked,
  disabled,
  onChange,
  onKeyDown,
  value,
  ...rest
}) => {
  return (
    <BaseCheckbox
      defaultChecked={checked}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      {...rest}
    >
      {"-"}
    </BaseCheckbox>
  )
}

export { BaseCheckbox, Checkbox, IndeterminateCheckbox }
