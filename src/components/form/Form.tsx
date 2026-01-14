import React, { useState, useCallback, createContext, useContext } from 'react'
import {
  ValidationRule,
  ValidationResult,
  validateForm,
  isFormValid,
  getFirstError
} from './validation'

// Form 上下文接口
interface FormContextValue {
  values: Record<string, any>
  errors: Record<string, ValidationResult>
  setValue: (name: string, value: any) => void
  validateField: (name: string) => boolean
  validateForm: () => boolean
  getFirstError: () => string | null
}

// Form 上下文
const FormContext = createContext<FormContextValue | null>(null)

// Hook 用于在子组件中访问 Form 上下文
const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context
}

export interface FormField {
  name: string
  rules?: ValidationRule[]
  initialValue?: any
}

export interface FormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  onChange?: (data: Record<string, any>, errors: Record<string, ValidationResult>) => void
  initialValues?: Record<string, any>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  className?: string
  children: React.ReactNode
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  onChange,
  initialValues = {},
  validateOnChange = false,
  validateOnBlur = true,
  className = '',
  children
}) => {
  // 初始化表单值
  const getInitialValues = useCallback(() => {
    const values: Record<string, any> = {}
    fields.forEach(field => {
      values[field.name] = initialValues[field.name] ?? field.initialValue ?? ''
    })
    return values
  }, [fields, initialValues])

  // 表单状态
  const [values, setValues] = useState<Record<string, any>>(getInitialValues)
  const [errors, setErrors] = useState<Record<string, ValidationResult>>({})

  // 验证规则映射
  const rulesMap = React.useMemo(() => {
    const map: Record<string, ValidationRule[]> = {}
    fields.forEach(field => {
      if (field.rules) {
        map[field.name] = field.rules
      }
    })
    return map
  }, [fields])

  // 设置字段值
  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))

    // 实时验证
    if (validateOnChange && rulesMap[name]) {
      const fieldErrors = validateForm({ [name]: value }, { [name]: rulesMap[name] })
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    }

    // 调用 onChange 回调
    if (onChange) {
      const newValues = { ...values, [name]: value }
      const newErrors = validateOnChange ? { ...errors, [name]: validateForm({ [name]: value }, { [name]: rulesMap[name] })[name] } : errors
      onChange(newValues, newErrors)
    }
  }, [values, errors, validateOnChange, rulesMap, onChange])

  // 验证单个字段
  const validateSingleField = useCallback((name: string): boolean => {
    if (!rulesMap[name]) return true

    const fieldErrors = validateForm({ [name]: values[name] }, { [name]: rulesMap[name] })
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    return fieldErrors[name].isValid
  }, [values, rulesMap])

  // 验证整个表单
  const validateAllFields = useCallback((): boolean => {
    const allErrors = validateForm(values, rulesMap)
    setErrors(allErrors)
    return isFormValid(allErrors)
  }, [values, rulesMap])

  // 获取第一个错误
  const getFirstErrorMessage = useCallback((): string | null => {
    return getFirstError(errors)
  }, [errors])

  // 处理表单提交
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // 验证所有字段
    if (!validateAllFields()) {
      console.warn('表单验证失败')
      return
    }

    try {
      await onSubmit(values)
    } catch (error) {
      console.error('表单提交失败:', error)
    }
  }

  // 处理字段失焦验证
  const handleFieldBlur = useCallback((name: string) => {
    if (validateOnBlur) {
      validateSingleField(name)
    }
  }, [validateOnBlur, validateSingleField])

  // 上下文值
  const contextValue: FormContextValue = {
    values,
    errors,
    setValue,
    validateField: validateSingleField,
    validateForm: validateAllFields,
    getFirstError: getFirstErrorMessage
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

// 导出表单相关 Hook 和工具
export { Form as default, useFormContext }

// 高阶组件：连接表单字段
export const withFormField = <P extends object>(
  Component: React.ComponentType<P & { name: string }>
) => {
  return React.forwardRef<any, P & { name: string }>((props, ref) => {
    const { name, ...rest } = props
    const formContext = useFormContext()

    const handleChange = (value: any) => {
      formContext.setValue(name, value)
    }

    const handleBlur = () => {
      formContext.validateField(name)
    }

    return (
      <Component
        ref={ref}
        {...(rest as P)}
        name={name}
        value={formContext.values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!formContext.errors[name]?.isValid}
        errorMessage={formContext.errors[name]?.message}
      />
    )
  })
}