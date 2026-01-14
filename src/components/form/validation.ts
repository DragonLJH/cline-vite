// 表单验证规则和工具函数

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  url?: boolean
  custom?: (value: any) => boolean | string
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

// 预定义的验证消息
const defaultMessages = {
  required: '此字段为必填项',
  minLength: (min: number) => `至少需要 ${min} 个字符`,
  maxLength: (max: number) => `最多允许 ${max} 个字符`,
  min: (min: number) => `最小值为 ${min}`,
  max: (max: number) => `最大值为 ${max}`,
  pattern: '格式不正确',
  email: '请输入有效的邮箱地址',
  url: '请输入有效的URL地址'
}

// 单个字段验证
export function validateField(value: any, rules: ValidationRule[]): ValidationResult {
  if (!rules || rules.length === 0) {
    return { isValid: true }
  }

  for (const rule of rules) {
    // 必填验证
    if (rule.required) {
      if (value === null || value === undefined || value === '') {
        return {
          isValid: false,
          message: rule.message || defaultMessages.required
        }
      }
    }

    // 如果值为空且非必填，跳过其他验证
    if (value === null || value === undefined || value === '') {
      continue
    }

    // 字符串转换为字符串进行验证
    const strValue = String(value)

    // 最小长度验证
    if (rule.minLength !== undefined && strValue.length < rule.minLength) {
      return {
        isValid: false,
        message: rule.message || defaultMessages.minLength(rule.minLength)
      }
    }

    // 最大长度验证
    if (rule.maxLength !== undefined && strValue.length > rule.maxLength) {
      return {
        isValid: false,
        message: rule.message || defaultMessages.maxLength(rule.maxLength)
      }
    }

    // 数字最小值验证
    if (rule.min !== undefined && !isNaN(Number(value)) && Number(value) < rule.min) {
      return {
        isValid: false,
        message: rule.message || defaultMessages.min(rule.min)
      }
    }

    // 数字最大值验证
    if (rule.max !== undefined && !isNaN(Number(value)) && Number(value) > rule.max) {
      return {
        isValid: false,
        message: rule.message || defaultMessages.max(rule.max)
      }
    }

    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(strValue)) {
      return {
        isValid: false,
        message: rule.message || defaultMessages.pattern
      }
    }

    // 邮箱验证
    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(strValue)) {
        return {
          isValid: false,
          message: rule.message || defaultMessages.email
        }
      }
    }

    // URL验证
    if (rule.url) {
      const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i
      if (!urlRegex.test(strValue)) {
        return {
          isValid: false,
          message: rule.message || defaultMessages.url
        }
      }
    }

    // 自定义验证
    if (rule.custom) {
      const result = rule.custom(value)
      if (result !== true) {
        return {
          isValid: false,
          message: typeof result === 'string' ? result : (rule.message || '验证失败')
        }
      }
    }
  }

  return { isValid: true }
}

// 整个表单验证
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule[]>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {}

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = data[fieldName]
    results[fieldName] = validateField(value, fieldRules)
  }

  return results
}

// 检查表单是否全部验证通过
export function isFormValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(result => result.isValid)
}

// 获取第一个错误消息
export function getFirstError(results: Record<string, ValidationResult>): string | null {
  for (const result of Object.values(results)) {
    if (!result.isValid && result.message) {
      return result.message
    }
  }
  return null
}