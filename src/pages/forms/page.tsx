// 表单组件展示页面

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
  Switch
} from '../../components/form'
import { useFormStore } from '../../stores/formStore'

const FormsPage: React.FC = () => {
  const formStore = useFormStore()

  // 表单字段配置
  const registrationFields = [
    { name: 'username', rules: [{ required: true, minLength: 3, maxLength: 20 }] },
    { name: 'email', rules: [{ required: true, email: true }] },
    { name: 'age', rules: [{ required: true, min: 18, max: 100 }] },
    { name: 'password', rules: [{ required: true, minLength: 6 }] },
    { name: 'confirmPassword', rules: [{ required: true }, { custom: (value: any, formData?: any) => value === formData?.password || '两次输入的密码不一致' }] },
    { name: 'gender', rules: [{ required: true }] },
    { name: 'interests', rules: [{ required: true }] },
    { name: 'country', rules: [{ required: true }] },
    { name: 'agreeTerms', rules: [{ required: true }] }
  ]

  const contactFields = [
    { name: 'name', rules: [{ required: true }] },
    { name: 'phone', rules: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }] },
    { name: 'email', rules: [{ email: true }] },
    { name: 'company' },
    { name: 'position' },
    { name: 'address' },
    { name: 'message', rules: [{ maxLength: 500 }] }
  ]

  const surveyFields = [
    { name: 'ageGroup', rules: [{ required: true }] },
    { name: 'education', rules: [{ required: true }] },
    { name: 'income', rules: [{ required: true }] },
    { name: 'interests', rules: [{ required: true }] },
    { name: 'satisfaction', rules: [{ min: 0, max: 10 }] },
    { name: 'recommend' }
  ]

  // 选项数据
  const genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' }
  ]

  const interestOptions = [
    { value: 'reading', label: '阅读' },
    { value: 'sports', label: '运动' },
    { value: 'music', label: '音乐' },
    { value: 'travel', label: '旅行' },
    { value: 'cooking', label: '烹饪' }
  ]

  const countryOptions = [
    { value: 'cn', label: '中国' },
    { value: 'us', label: '美国' },
    { value: 'jp', label: '日本' },
    { value: 'kr', label: '韩国' },
    { value: 'sg', label: '新加坡' }
  ]

  const educationOptions = [
    { value: 'high_school', label: '高中' },
    { value: 'associate', label: '大专' },
    { value: 'bachelor', label: '本科' },
    { value: 'master', label: '硕士' },
    { value: 'phd', label: '博士' }
  ]

  const incomeOptions = [
    { value: 'under_5k', label: '5K以下' },
    { value: '5k_10k', label: '5K-10K' },
    { value: '10k_20k', label: '10K-20K' },
    { value: '20k_50k', label: '20K-50K' },
    { value: 'over_50k', label: '50K以上' }
  ]

  // 处理表单提交
  const handleFormSubmit = (formName: string, data: Record<string, any>) => {
    console.log(`${formName} 表单提交:`, data)

    // 将数据存储到store中
    formStore.addSubmission(formName, data, 'success')

    // 显示成功提示
    alert(`${formName} 表单提交成功！数据已保存到本地存储。`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📝 表单组件展示
            </h1>
            <p className="text-lg text-gray-600">
              展示各种表单组件的使用示例和常见表单场景
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 用户注册表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              👤 用户注册表单
            </h2>
            <p className="text-gray-600">
              完整的用户注册表单，包含所有常用输入组件和验证规则
            </p>
          </div>

          <Form
            fields={registrationFields}
            onSubmit={(data) => handleFormSubmit('用户注册', data)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormItem name="username" label="用户名" required>
              <Input placeholder="请输入用户名" />
            </FormItem>

            <FormItem name="email" label="邮箱" required>
              <Input type="email" placeholder="请输入邮箱地址" />
            </FormItem>

            <FormItem name="age" label="年龄" required>
              <NumberInput min={18} max={100} placeholder="请输入年龄" />
            </FormItem>

            <FormItem name="password" label="密码" required>
              <PasswordInput placeholder="请输入密码" />
            </FormItem>

            <FormItem name="confirmPassword" label="确认密码" required>
              <PasswordInput placeholder="请再次输入密码" />
            </FormItem>

            <FormItem name="gender" label="性别" required>
              <RadioGroup name="gender" options={genderOptions} direction="horizontal" />
            </FormItem>

            <FormItem name="interests" label="兴趣爱好" required className="md:col-span-2">
              <CheckboxGroup name="interests" options={interestOptions} direction="horizontal" />
            </FormItem>

            <FormItem name="country" label="国家" required>
              <Select options={countryOptions} placeholder="请选择国家" />
            </FormItem>

            <div className="flex items-center space-x-2">
              <FormItem name="agreeTerms" required className="md:col-span-2">
                <Switch />
              </FormItem>
              <span className="text-sm text-gray-700">
                我同意服务条款和隐私政策
              </span>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                注册账号
              </button>
            </div>
          </Form>
        </div>

        {/* 联系方式表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📞 联系方式表单
            </h2>
            <p className="text-gray-600">
              联系信息收集表单，包含电话验证和多行文本输入
            </p>
          </div>

          <Form
            fields={contactFields}
            onSubmit={(data) => handleFormSubmit('联系方式', data)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormItem name="name" label="姓名" required>
              <Input placeholder="请输入姓名" />
            </FormItem>

            <FormItem name="phone" label="联系电话" required>
              <Input placeholder="请输入手机号" />
            </FormItem>

            <FormItem name="email" label="邮箱">
              <Input type="email" placeholder="请输入邮箱地址" />
            </FormItem>

            <FormItem name="company" label="公司">
              <Input placeholder="请输入公司名称" />
            </FormItem>

            <FormItem name="position" label="职位">
              <Input placeholder="请输入职位" />
            </FormItem>

            <FormItem name="address" label="联系地址" className="md:col-span-2">
              <Textarea placeholder="请输入详细地址" rows={3} />
            </FormItem>

            <FormItem name="message" label="留言内容" className="md:col-span-2">
              <Textarea placeholder="请输入留言内容" rows={4} />
            </FormItem>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
              >
                提交联系信息
              </button>
            </div>
          </Form>
        </div>

        {/* 调查问卷表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📊 用户调查问卷
            </h2>
            <p className="text-gray-600">
              用户满意度调查问卷，包含多种选择组件和评分组件
            </p>
          </div>

          <Form
            fields={surveyFields}
            onSubmit={(data) => handleFormSubmit('调查问卷', data)}
            className="space-y-6"
          >
            <FormItem name="ageGroup" label="年龄段" required>
              <RadioGroup
                name="ageGroup"
                options={[
                  { value: 'under_18', label: '18岁以下' },
                  { value: '18_25', label: '18-25岁' },
                  { value: '26_35', label: '26-35岁' },
                  { value: '36_50', label: '36-50岁' },
                  { value: 'over_50', label: '50岁以上' }
                ]}
              />
            </FormItem>

            <FormItem name="education" label="教育程度" required>
              <Select options={educationOptions} placeholder="请选择教育程度" />
            </FormItem>

            <FormItem name="income" label="月收入范围" required>
              <RadioGroup name="income" options={incomeOptions} />
            </FormItem>

            <FormItem name="interests" label="兴趣爱好" required>
              <CheckboxGroup
                name="interests"
                options={interestOptions}
                direction="horizontal"
              />
            </FormItem>

            <FormItem name="satisfaction" label="整体满意度 (0-10分)">
              <div className="space-y-2">
                <NumberInput min={0} max={10} placeholder="请评分 (0-10)" />
                <p className="text-xs text-gray-500">0分表示非常不满意，10分表示非常满意</p>
              </div>
            </FormItem>

            <FormItem name="recommend">
              <div className="flex items-center space-x-2">
                <Switch />
                <span className="text-sm text-gray-700">
                  是否愿意向朋友推荐我们的产品/服务
                </span>
              </div>
            </FormItem>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium"
              >
                提交问卷
              </button>
            </div>
          </Form>
        </div>

        {/* 电商订单表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🛒 电商订单表单
            </h2>
            <p className="text-gray-600">
              电商平台订单信息填写，包含商品选择和配送信息
            </p>
          </div>

          <Form
            fields={[
              { name: 'product', rules: [{ required: true }] },
              { name: 'quantity', rules: [{ required: true, min: 1, max: 99 }] },
              { name: 'recipientName', rules: [{ required: true }] },
              { name: 'phone', rules: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }] },
              { name: 'address', rules: [{ required: true }] },
              { name: 'deliveryMethod', rules: [{ required: true }] },
              { name: 'paymentMethod', rules: [{ required: true }] },
              { name: 'orderNotes', rules: [{ maxLength: 200 }] }
            ]}
            onSubmit={(data) => handleFormSubmit('电商订单', data)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormItem name="product" label="商品选择" required>
              <Select
                options={[
                  { value: 'laptop', label: '笔记本电脑' },
                  { value: 'phone', label: '智能手机' },
                  { value: 'tablet', label: '平板电脑' },
                  { value: 'headphones', label: '耳机' }
                ]}
                placeholder="请选择商品"
              />
            </FormItem>

            <FormItem name="quantity" label="购买数量" required>
              <NumberInput min={1} max={99} placeholder="请输入数量" />
            </FormItem>

            <FormItem name="recipientName" label="收货人姓名" required>
              <Input placeholder="请输入收货人姓名" />
            </FormItem>

            <FormItem name="phone" label="联系电话" required>
              <Input placeholder="请输入手机号" />
            </FormItem>

            <FormItem name="address" label="收货地址" required className="md:col-span-2">
              <Textarea placeholder="请输入详细收货地址" rows={3} />
            </FormItem>

            <FormItem name="deliveryMethod" label="配送方式" required>
              <RadioGroup
                name="deliveryMethod"
                options={[
                  { value: 'express', label: '快递配送' },
                  { value: 'pickup', label: '门店自提' },
                  { value: 'same_day', label: '同城配送' }
                ]}
              />
            </FormItem>

            <FormItem name="paymentMethod" label="支付方式" required>
              <RadioGroup
                name="paymentMethod"
                options={[
                  { value: 'alipay', label: '支付宝' },
                  { value: 'wechat', label: '微信支付' },
                  { value: 'bank', label: '银行卡' }
                ]}
              />
            </FormItem>

            <FormItem name="orderNotes" label="订单备注" className="md:col-span-2">
              <Textarea placeholder="如有特殊要求请填写" rows={3} />
            </FormItem>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
              >
                提交订单
              </button>
            </div>
          </Form>
        </div>

        {/* 项目任务表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📋 项目任务表单
            </h2>
            <p className="text-gray-600">
              项目管理任务创建表单，包含任务分配和时间规划
            </p>
          </div>

          <Form
            fields={[
              { name: 'taskTitle', rules: [{ required: true, minLength: 2, maxLength: 100 }] },
              { name: 'taskDescription', rules: [{ required: true, maxLength: 500 }] },
              { name: 'priority', rules: [{ required: true }] },
              { name: 'assignee', rules: [{ required: true }] },
              { name: 'dueDate', rules: [{ required: true }] },
              { name: 'estimatedHours', rules: [{ min: 0.5, max: 100 }] },
              { name: 'tags', rules: [{ required: true }] }
            ]}
            onSubmit={(data) => handleFormSubmit('项目任务', data)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormItem name="taskTitle" label="任务标题" required className="md:col-span-2">
              <Input placeholder="请输入任务标题" />
            </FormItem>

            <FormItem name="taskDescription" label="任务描述" required className="md:col-span-2">
              <Textarea placeholder="详细描述任务内容和要求" rows={4} />
            </FormItem>

            <FormItem name="priority" label="优先级" required>
              <RadioGroup
                name="priority"
                options={[
                  { value: 'low', label: '低优先级' },
                  { value: 'medium', label: '中优先级' },
                  { value: 'high', label: '高优先级' },
                  { value: 'urgent', label: '紧急' }
                ]}
              />
            </FormItem>

            <FormItem name="assignee" label="负责人" required>
              <Select
                options={[
                  { value: 'alice', label: 'Alice' },
                  { value: 'bob', label: 'Bob' },
                  { value: 'charlie', label: 'Charlie' },
                  { value: 'diana', label: 'Diana' }
                ]}
                placeholder="选择负责人"
              />
            </FormItem>

            <FormItem name="dueDate" label="截止日期" required>
              <Input type="date" />
            </FormItem>

            <FormItem name="estimatedHours" label="预估工时(小时)">
              <NumberInput min={0.5} max={100} step={0.5} placeholder="预估需要的小时数" />
            </FormItem>

            <FormItem name="tags" label="标签" required className="md:col-span-2">
              <CheckboxGroup
                name="tags"
                options={[
                  { value: 'frontend', label: '前端' },
                  { value: 'backend', label: '后端' },
                  { value: 'design', label: '设计' },
                  { value: 'testing', label: '测试' },
                  { value: 'documentation', label: '文档' },
                  { value: 'bugfix', label: 'Bug修复' },
                  { value: 'feature', label: '新功能' }
                ]}
                direction="horizontal"
              />
            </FormItem>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium"
              >
                创建任务
              </button>
            </div>
          </Form>
        </div>

        {/* 医疗预约表单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🏥 医疗预约表单
            </h2>
            <p className="text-gray-600">
              医院挂号预约系统，包含科室选择和患者信息
            </p>
          </div>

          <Form
            fields={[
              { name: 'department', rules: [{ required: true }] },
              { name: 'doctor', rules: [{ required: true }] },
              { name: 'appointmentDate', rules: [{ required: true }] },
              { name: 'timeSlot', rules: [{ required: true }] },
              { name: 'patientName', rules: [{ required: true }] },
              { name: 'idNumber' },
              { name: 'phone', rules: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }] },
              { name: 'symptoms', rules: [{ required: true }] },
              { name: 'isFirstVisit', rules: [{ required: true }] },
              { name: 'allergies' }
            ]}
            onSubmit={(data) => handleFormSubmit('医疗预约', data)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <FormItem name="department" label="科室" required>
              <Select
                options={[
                  { value: 'internal', label: '内科' },
                  { value: 'surgery', label: '外科' },
                  { value: 'pediatrics', label: '儿科' },
                  { value: 'gynecology', label: '妇科' },
                  { value: 'ophthalmology', label: '眼科' },
                  { value: 'dermatology', label: '皮肤科' }
                ]}
                placeholder="请选择科室"
              />
            </FormItem>

            <FormItem name="doctor" label="医生" required>
              <Select
                options={[
                  { value: 'dr_smith', label: 'Smith医生' },
                  { value: 'dr_johnson', label: 'Johnson医生' },
                  { value: 'dr_williams', label: 'Williams医生' },
                  { value: 'dr_brown', label: 'Brown医生' }
                ]}
                placeholder="请选择医生"
              />
            </FormItem>

            <FormItem name="appointmentDate" label="预约日期" required>
              <Input type="date" />
            </FormItem>

            <FormItem name="timeSlot" label="时段" required>
              <RadioGroup
                name="timeSlot"
                options={[
                  { value: 'morning', label: '上午 (9:00-12:00)' },
                  { value: 'afternoon', label: '下午 (14:00-17:00)' }
                ]}
              />
            </FormItem>

            <FormItem name="patientName" label="患者姓名" required>
              <Input placeholder="请输入患者姓名" />
            </FormItem>

            <FormItem name="idNumber" label="身份证号">
              <Input placeholder="请输入身份证号" />
            </FormItem>

            <FormItem name="phone" label="联系电话" required>
              <Input placeholder="请输入联系电话" />
            </FormItem>

            <FormItem name="isFirstVisit" label="是否初诊" required>
              <RadioGroup
                name="isFirstVisit"
                options={[
                  { value: 'true', label: '初诊' },
                  { value: 'false', label: '复诊' }
                ]}
                direction="horizontal"
              />
            </FormItem>

            <FormItem name="symptoms" label="症状描述" required className="md:col-span-2">
              <Textarea placeholder="请详细描述您的症状和不适" rows={4} />
            </FormItem>

            <FormItem name="allergies" label="过敏史" className="md:col-span-2">
              <Textarea placeholder="如有药物过敏或其他过敏史，请详细说明" rows={3} />
            </FormItem>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
              >
                提交预约
              </button>
            </div>
          </Form>
        </div>

        {/* 提交结果显示 */}
        {formStore.getRecentSubmissions().length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 表单提交历史
            </h3>
            <div className="space-y-4">
              {formStore.getRecentSubmissions().map((submission) => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{submission.formName}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(submission.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
                    {JSON.stringify(submission.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center space-x-2">
              <button
                onClick={() => formStore.clearAllSubmissions()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                清除所有历史
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        )}

        {/* 组件特性说明 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 表单组件库特性
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-medium text-gray-900 mb-1">纯 Tailwind CSS</h4>
              <p className="text-sm text-gray-600">所有样式使用Tailwind，无CSS变量</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-medium text-gray-900 mb-1">表单验证</h4>
              <p className="text-sm text-gray-600">内置+自定义验证规则</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-medium text-gray-900 mb-1">响应式设计</h4>
              <p className="text-sm text-gray-600">支持多种屏幕尺寸</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">♿</div>
              <h4 className="font-medium text-gray-900 mb-1">无障碍访问</h4>
              <p className="text-sm text-gray-600">键盘导航和屏幕阅读器支持</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormsPage
