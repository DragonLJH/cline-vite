// 表单组件使用示例

import React, { useState } from 'react'
import {
  Form,
  FormItem,
  Input,
  NumberInput,
  PasswordInput,
  Textarea,
  Select,
  RadioGroup,
  CheckboxGroup,
  Switch,
  FormField
} from './index'

// 示例数据
const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
]

const interestOptions = [
  { value: 'reading', label: '阅读' },
  { value: 'sports', label: '运动' },
  { value: 'music', label: '音乐' },
  { value: 'travel', label: '旅行' }
]

const countryOptions = [
  { value: 'cn', label: '中国' },
  { value: 'us', label: '美国' },
  { value: 'jp', label: '日本' },
  { value: 'kr', label: '韩国' }
]

// 表单字段配置
const formFields: FormField[] = [
  {
    name: 'username',
    rules: [
      { required: true, message: '请输入用户名' },
      { minLength: 3, message: '用户名至少3个字符' },
      { maxLength: 20, message: '用户名最多20个字符' }
    ]
  },
  {
    name: 'email',
    rules: [
      { required: true, message: '请输入邮箱' },
      { email: true, message: '请输入有效的邮箱地址' }
    ]
  },
  {
    name: 'age',
    rules: [
      { required: true, message: '请输入年龄' },
      { min: 18, message: '年龄必须大于18岁' },
      { max: 100, message: '年龄不能超过100岁' }
    ]
  },
  {
    name: 'password',
    rules: [
      { required: true, message: '请输入密码' },
      { minLength: 6, message: '密码至少6个字符' }
    ]
  },
  {
    name: 'confirmPassword',
    rules: [
      { required: true, message: '请确认密码' },
      {
        custom: (value: any, formData?: any) => {
          if (value !== formData?.password) {
            return '两次输入的密码不一致'
          }
          return true
        },
        message: '两次输入的密码不一致'
      }
    ]
  },
  {
    name: 'bio',
    rules: [
      { maxLength: 200, message: '个人简介最多200个字符' }
    ]
  },
  {
    name: 'gender',
    rules: [
      { required: true, message: '请选择性别' }
    ]
  },
  {
    name: 'interests',
    rules: [
      { required: true, message: '请至少选择一个兴趣爱好' }
    ]
  },
  {
    name: 'country',
    rules: [
      { required: true, message: '请选择国家' }
    ]
  },
  {
    name: 'agreeTerms',
    rules: [
      { required: true, message: '请同意服务条款' }
    ]
  }
]

const FormExample: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: Record<string, any>) => {
    console.log('表单提交数据:', data)
    setLoading(true)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLoading(false)
    alert('注册成功！')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">用户注册表单</h1>

      <Form
        fields={formFields}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        className="space-y-6"
      >
        {/* 用户名 */}
        <FormItem
          name="username"
          label="用户名"
          required
          help="用户名将用于登录，请选择一个易记的名称"
        >
          <Input placeholder="请输入用户名" />
        </FormItem>

        {/* 邮箱 */}
        <FormItem name="email" label="邮箱" required>
          <Input type="email" placeholder="请输入邮箱地址" />
        </FormItem>

        {/* 年龄 */}
        <FormItem name="age" label="年龄" required>
          <NumberInput min={1} max={120} placeholder="请输入年龄" />
        </FormItem>

        {/* 密码 */}
        <FormItem name="password" label="密码" required>
          <PasswordInput placeholder="请输入密码" />
        </FormItem>

        {/* 确认密码 */}
        <FormItem name="confirmPassword" label="确认密码" required>
          <PasswordInput placeholder="请再次输入密码" />
        </FormItem>

        {/* 个人简介 */}
        <FormItem
          name="bio"
          label="个人简介"
          help="可选，最多200个字符"
        >
          <Textarea
            rows={4}
            placeholder="请简单介绍一下自己"
            resize="vertical"
          />
        </FormItem>

        {/* 性别 */}
        <FormItem name="gender" label="性别" required>
          <RadioGroup
            name="gender"
            options={genderOptions}
            direction="horizontal"
          />
        </FormItem>

        {/* 兴趣爱好 */}
        <FormItem name="interests" label="兴趣爱好" required>
          <CheckboxGroup
            name="interests"
            options={interestOptions}
            direction="horizontal"
          />
        </FormItem>

        {/* 国家 */}
        <FormItem name="country" label="国家" required>
          <Select
            options={countryOptions}
            placeholder="请选择国家"
          />
        </FormItem>

        {/* 同意条款 */}
        <FormItem name="agreeTerms" required>
          <div className="flex items-center space-x-2">
            <Switch />
            <span className="text-sm text-gray-700">
              我同意
              <a href="#" className="text-blue-500 hover:text-blue-700 ml-1">
                《服务条款》
              </a>
              和
              <a href="#" className="text-blue-500 hover:text-blue-700 ml-1">
                《隐私政策》
              </a>
            </span>
          </div>
        </FormItem>

        {/* 提交按钮 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? '提交中...' : '注册账号'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default FormExample
