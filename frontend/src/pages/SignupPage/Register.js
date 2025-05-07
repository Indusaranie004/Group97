import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Select, 
  Typography, 
  Checkbox, 
  Card, 
  Row, 
  Col,
  DatePicker
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { confirmPassword, termsAgreed, ...registrationData } = values;
      if (registrationData.dateOfBirth) {
        registrationData.dateOfBirth = registrationData.dateOfBirth.format('YYYY-MM-DD');
      }
      await register(registrationData);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f9f9f4',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 800,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: 12,
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Row>
          <Col xs={24} md={14} style={{ padding: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', width: '175%' }}>
              <Title level={2} style={{ color: '#0a1f34', marginBottom: 30, textAlign: 'center' }}>
                Create Account
              </Title>
              <Form 
                name="register" 
                form={form}
                layout="vertical" 
                onFinish={onFinish}
                requiredMark={false}
                scrollToFirstError
              >
                <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your full name' }]}> 
                  <Input prefix={<UserOutlined style={{ color: '#0a1f34' }} />} placeholder="John Doe" size="large" />
                </Form.Item>

                <Form.Item name="email" label="Email Address" rules={[{ required: true, message: 'Please enter your email' },{ type: 'email', message: 'Please enter a valid email' }]}> 
                  <Input prefix={<MailOutlined style={{ color: '#0a1f34' }} />} placeholder="john.doe@example.com" size="large" />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter a password' },{ min: 8, message: 'Password must be at least 8 characters' }]}> 
                  <Input.Password prefix={<LockOutlined style={{ color: '#0a1f34' }} />} placeholder="Create a strong password" size="large" />
                </Form.Item>

                <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']} rules={[{ required: true, message: 'Please confirm your password' },({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match')); }, })]}> 
                  <Input.Password prefix={<LockOutlined style={{ color: '#0a1f34' }} />} placeholder="Confirm your password" size="large" />
                </Form.Item>

                <Form.Item name="role" label="I am joining as" rules={[{ required: true, message: 'Please select your role' }]}> 
                  <Select placeholder="Select your role" size="large" suffixIcon={<TeamOutlined style={{ color: '#0a1f34' }} />}> 
                    <Select.Option value="member">Member</Select.Option>
                    <Select.Option value="coach">Coach</Select.Option>
                    <Select.Option value="HR manager">HR Manager</Select.Option>
                    <Select.Option value="financial manager">Financial Manager</Select.Option>
                    <Select.Option value="Feedback manager">Feedback Manager</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="dateOfBirth" label="Date of Birth (optional)"> 
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Select date of birth" size="large" suffixIcon={<CalendarOutlined style={{ color: '#0a1f34' }} />} />
                </Form.Item>

                <Form.Item name="termsAgreed" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and conditions')) }]}> 
                  <Checkbox>
                    I agree to the <a href="#" style={{ color: '#0f3052' }}>Terms of Service</a> and <a href="#" style={{ color: '#0f3052' }}>Privacy Policy</a>
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', backgroundColor: '#42d4cf', borderColor: '#42d4cf', height: 45, fontSize: 16 }}> 
                    Register
                  </Button>
                </Form.Item>
              </Form>
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Text type="secondary">
                  Already have an account? <Link to="/login" style={{ color: '#0f3052' }}>Login now</Link>
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Register;
