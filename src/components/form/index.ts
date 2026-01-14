// 表单组件库导出文件

// 核心组件
export { default as Input } from './Input'
export { default as NumberInput } from './NumberInput'
export { default as PasswordInput } from './PasswordInput'
export { default as Textarea } from './Textarea'
export { default as Select } from './Select'
export { default as RadioGroup } from './RadioGroup'
export { default as CheckboxGroup } from './CheckboxGroup'
export { default as Switch } from './Switch'

// 表单容器和工具
export { default as Form, useFormContext, withFormField } from './Form'
export { default as FormItem } from './FormItem'

// 验证工具
export {
  validateField,
  validateForm,
  isFormValid,
  getFirstError
} from './validation'
export type {
  ValidationRule,
  ValidationResult
} from './validation'

// 组件类型导出
export type { InputProps } from './Input'
export type { NumberInputProps } from './NumberInput'
export type { PasswordInputProps } from './PasswordInput'
export type { TextareaProps } from './Textarea'
export type { SelectProps, SelectOption } from './Select'
export type { RadioGroupProps, RadioOption } from './RadioGroup'
export type { CheckboxGroupProps, CheckboxOption } from './CheckboxGroup'
export type { SwitchProps } from './Switch'
export type { FormProps, FormField } from './Form'
export type { FormItemProps } from './FormItem'
