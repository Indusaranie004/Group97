import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Typography, 
  Divider, 
  Card, 
  Row, 
  Col,
  Checkbox
} from 'antd';
import { 
  MailOutlined, 
  LockOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { rememberMe, ...loginData } = values;
      await login(loginData);
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
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
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              height: '100%',
              width: '175%'
            }}>
              <Title level={2} style={{ color: '#0a1f34', marginBottom: 30, textAlign: 'center' }}>
                Welcome Back
              </Title>

              <Form 
                name="login" 
                form={form}
                layout="vertical" 
                onFinish={onFinish}
                requiredMark={false}
                initialValues={{ rememberMe: true }}
              >
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#0a1f34' }} />} 
                    placeholder="your.email@example.com" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#0a1f34' }} />} 
                    placeholder="Your password" 
                    size="large"
                  />
                </Form.Item>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 24
                }}>
                  <Form.Item 
                    name="rememberMe" 
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox style={{ color: '#0f3052' }}>Remember me</Checkbox>
                  </Form.Item>

                  <Link to="/forgot-password" style={{ color: '#0f3052' }}>
                    Forgot password?
                  </Link>
                </div>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<LoginOutlined />}
                    style={{ 
                      width: '100%',
                      backgroundColor: '#42d4cf',
                      borderColor: '#42d4cf',
                      height: 45,
                      fontSize: 16
                    }}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>

              <Divider>
                <Text type="secondary">New to FitnessPro?</Text>
              </Divider>

              <Link to="/register">
                <Button 
                  type="default" 
                  style={{ 
                    width: '100%',
                    height: 45,
                    fontSize: 16,
                    borderColor: '#42d4cf',
                    color: '#0a1f34'
                  }}
                >
                  Create an Account
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;