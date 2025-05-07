
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Layout, Menu, Avatar, Descriptions, Button, Card, message, 
  Row, Col, Typography, Divider, Modal, Form, Input, 
  Select, DatePicker, Tabs, Space, Tooltip, Badge, 
  Statistic, Input as AntInput, Spin, Progress, Calendar, Tag
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined,
  DashboardOutlined,
  SettingOutlined,
  SearchOutlined,
  DownloadOutlined,
  BellOutlined,
  FireOutlined,
  TrophyOutlined,
  CalendarOutlined,
  LineChartOutlined,
  HistoryOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Header, Sider, Content, Footer } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Search } = AntInput;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const { user, bioData, logout, deleteBioData, saveBioData, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [localBioData, setLocalBioData] = useState(bioData);
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  // Fitness data
  const [fitnessData, setFitnessData] = useState({
    workoutsCompleted: 24,
    caloriesBurned: 12450,
    activeDays: 18,
    totalHours: 36,
    streakDays: 5,
    achievements: 8,
    nextGoal: 'Complete 30 workouts'
  });
  
  // Workout types data
  const [workoutTypes, setWorkoutTypes] = useState([
    { type: 'Cardio', sessions: 10, caloriesBurned: 4200, color: '#3498db' },
    { type: 'Strength', sessions: 8, caloriesBurned: 3800, color: '#e74c3c' },
    { type: 'Flexibility', sessions: 4, caloriesBurned: 1200, color: '#1abc9c' },
    { type: 'HIIT', sessions: 2, caloriesBurned: 3250, color: '#f39c12' }
  ]);
  
  // Recent workouts
  const [recentWorkouts, setRecentWorkouts] = useState([
    {
      id: 1,
      date: '2025-05-04',
      type: 'Strength',
      duration: 45,
      caloriesBurned: 320,
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 10, weight: 70 },
        { name: 'Squats', sets: 3, reps: 12, weight: 100 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 120 }
      ]
    },
    {
      id: 2,
      date: '2025-05-02',
      type: 'Cardio',
      duration: 30,
      caloriesBurned: 280,
      exercises: [
        { name: 'Treadmill', duration: 20, distance: 3.5, speed: 10.5 },
        { name: 'Rowing Machine', duration: 10, distance: 2, intensity: 8 }
      ]
    },
    {
      id: 3,
      date: '2025-04-30',
      type: 'HIIT',
      duration: 25,
      caloriesBurned: 350,
      exercises: [
        { name: 'Burpees', sets: 4, reps: 15 },
        { name: 'Mountain Climbers', sets: 4, reps: 20 },
        { name: 'Jump Squats', sets: 4, reps: 15 }
      ]
    }
  ]);
  
  // Upcoming classes
  const [upcomingClasses, setUpcomingClasses] = useState([
    {
      id: 1,
      name: 'HIIT Circuit',
      instructor: 'John Smith',
      date: '2025-05-08',
      time: '18:00',
      duration: 45,
      spotsRemaining: 3
    },
    {
      id: 2,
      name: 'Yoga Flow',
      instructor: 'Sarah Johnson',
      date: '2025-05-09',
      time: '09:30',
      duration: 60,
      spotsRemaining: 8
    },
    {
      id: 3,
      name: 'Spin Class',
      instructor: 'Mike Wilson',
      date: '2025-05-10',
      time: '10:00',
      duration: 50,
      spotsRemaining: 5
    }
  ]);
  
  const navigate = useNavigate();

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const momentDate = moment(dateString);
      if (momentDate.isValid()) {
        return momentDate.format('MMMM D, YYYY');
      }
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return 'Not available';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Not available';
    }
  };

  // Mock search function
  const handleSearch = (value) => {
    setSearchValue(value);
    setSearchLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      setSearchLoading(false);
      message.info(`Search results for "${value}" would appear here`);
    }, 800);
  };

  // Sync localBioData with context bioData
  useEffect(() => {
    setLocalBioData(bioData);
  }, [bioData]);

  // Initialize bio form with current values when modal opens
  useEffect(() => {
    if (formVisible) {
      form.resetFields();
      if (localBioData) {
        form.setFieldsValue({
          age: localBioData.age,
          gender: localBioData.gender,
          height: localBioData.height,
          weight: localBioData.weight,
          bloodType: localBioData.bloodType,
          allergies: localBioData.allergies || '',
          medicalConditions: localBioData.medicalConditions || ''
        });
      } else {
        form.setFieldsValue({
          gender: 'male',
          bloodType: 'A+'
        });
      }
    }
  }, [formVisible, localBioData, form]);

  // Initialize profile form with current user values
  useEffect(() => {
    if (editProfileVisible && user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null
      });
    }
  }, [editProfileVisible, user, profileForm]);

  const handleDeleteAccount = () => {
    console.log('Delete Account function triggered'); // Debug log
    Modal.confirm({
      title: 'Are you sure you want to delete your account?',
      content: 'This action cannot be undone. All your data will be permanently removed.',
      okText: 'Delete Account',
      okType: 'danger',
      okButtonProps: { 
        style: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' }
      },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          console.log('Delete confirmation accepted'); // Debug log
          setDeleteAccountLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No authentication token found'); // Debug log
            throw new Error('No authentication token found');
          }

          console.log('Sending delete request to API...'); // Debug log
          const response = await fetch('/api/users/profile', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          const responseText = await response.text();
          console.log('Delete response status:', response.status); // Debug log
          console.log('Delete response body:', responseText); // Debug log

          if (response.ok) {
            message.success('Your account has been deleted successfully');
            localStorage.removeItem('token');
            console.log('Token removed, logging out...'); // Debug log
            await logout();
            navigate('/');
          } else {
            let errorMessage = 'Failed to delete account';
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              errorMessage = responseText || errorMessage;
            }
            console.error('Delete account failed:', errorMessage); // Debug log
            message.error(errorMessage);
          }
        } catch (error) {
          console.error('Delete account error:', error); // Debug log
          message.error(`Failed to delete account: ${error.message}`);
        } finally {
          setDeleteAccountLoading(false);
        }
      }
    });
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting biomedical data...'); // Debug log
      setDeleteLoading(true);
      
      // Check if deleteBioData function exists
      if (typeof deleteBioData !== 'function') {
        console.error('deleteBioData is not a function:', deleteBioData);
        throw new Error('Delete function is not available');
      }
      
      // Call the delete function from context
      const result = await deleteBioData();
      console.log('Delete result:', result); // Debug log
      
      // Update local state
      setLocalBioData(null);
      message.success('Biomedical data deleted successfully');
    } catch (error) {
      console.error('Error deleting biomedical data:', error); // Debug log
      message.error(`Failed to delete biomedical data: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const onBioFormFinish = async (values) => {
    try {
      setLoading(true);
      const numericValues = {
        ...values,
        age: Number(values.age),
        height: Number(values.height),
        weight: Number(values.weight)
      };
      
      const updatedData = await saveBioData(numericValues);
      setLocalBioData(updatedData);
      message.success('Biomedical data saved successfully');
      setFormVisible(false);
    } catch (error) {
      message.error('Failed to save biomedical data');
    } finally {
      setLoading(false);
    }
  };

  const onProfileFormFinish = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...values,
          dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null
        })
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Profile updated successfully');
        setEditProfileVisible(false);
        updateUser(data);
      } else {
        message.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBioFormCancel = () => {
    form.resetFields();
    setFormVisible(false);
  };

  const handleProfileFormCancel = () => {
    profileForm.resetFields();
    setEditProfileVisible(false);
  };

  // PDF download handler for medical records
  const handleDownloadMedicalPDF = () => {
    if (!localBioData || !user) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 40;

    pdf.setFontSize(18);
    pdf.setTextColor('#3498db');
    pdf.text('FitnessPro Medical Record', pageWidth / 2, y, { align: 'center' });
    y += 30;
    pdf.setFontSize(12);
    pdf.setTextColor('#2c3e50');
    pdf.text(`Name: ${user.name || ''}`, 40, y);
    pdf.text(`Email: ${user.email || ''}`, 40, y + 18);
    pdf.text(`Date of Birth: ${formatDate(user.dateOfBirth)}`, 40, y + 36);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 150, y);
    y += 50;

    pdf.setFontSize(16);
    pdf.setTextColor('#2c3e50');
    pdf.text('Medical Record Details', 40, y);
    y += 20;

    pdf.setFontSize(12);
    pdf.setTextColor('#2c3e50');
    const fields = [
      ['Age', `${localBioData.age} ${localBioData.age === 1 ? 'year' : 'years'}`],
      ['Gender', localBioData.gender.charAt(0).toUpperCase() + localBioData.gender.slice(1)],
      ['Height', `${localBioData.height} cm`],
      ['Weight', `${localBioData.weight} kg`],
      ['Blood Type', localBioData.bloodType],
      ['Allergies', localBioData.allergies || 'None reported'],
      ['Medical Conditions', localBioData.medicalConditions || 'None reported'],
    ];
    fields.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(`${label}:`, 60, y);
      pdf.setFont(undefined, 'normal');
      pdf.text(value, 180, y);
      y += 22;
    });

    pdf.setFontSize(10);
    pdf.setTextColor('#aaa');
    pdf.text('Generated by FitnessPro', pageWidth / 2, pdf.internal.pageSize.getHeight() - 30, { align: 'center' });

    pdf.save('medical_record.pdf');
  };

  // PDF download handler for fitness report
  const handleDownloadFitnessReport = () => {
    if (!user) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 40;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor('#2c3e50');
    pdf.text('FitnessPro', 40, y);
    y += 12;
    
    pdf.setFontSize(10);
    pdf.setTextColor('#7f8c8d');
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 150, y);
    
    // Add horizontal line
    y += 20;
    pdf.setDrawColor('#ecf0f1');
    pdf.setLineWidth(1);
    pdf.line(40, y, pageWidth - 40, y);
    y += 25;
    
    // Report title
    pdf.setFontSize(18);
    pdf.setTextColor('#2c3e50');
    pdf.text('Fitness Progress Report', 40, y);
    y += 30;
    
    // User info
    pdf.setFontSize(12);
    pdf.setTextColor('#2c3e50');
    pdf.text(`Name: ${user.name || ''}`, 40, y);
    y += 20;
    
    // Stats summary
    pdf.setFontSize(14);
    pdf.setTextColor('#3498db');
    pdf.text('Workout Statistics', 40, y);
    y += 25;
    
    pdf.setFontSize(12);
    pdf.setTextColor('#2c3e50');
    
    const fields = [
      ['Workouts Completed:', fitnessData.workoutsCompleted.toString()],
      ['Calories Burned:', `${fitnessData.caloriesBurned} kcal`],
      ['Active Days:', fitnessData.activeDays.toString()],
      ['Total Hours:', `${fitnessData.totalHours} hours`],
      ['Current Streak:', `${fitnessData.streakDays} days`],
      ['Achievements Earned:', fitnessData.achievements.toString()],
    ];
    
    fields.forEach(([label, value]) => {
      pdf.text(label, 40, y);
      pdf.text(value, 200, y);
      y += 25;
    });
    
    // Workout breakdown
    y += 15;
    pdf.setFontSize(14);
    pdf.setTextColor('#3498db');
    pdf.text('Workout Type Breakdown', 40, y);
    y += 25;
    
    workoutTypes.forEach(workout => {
      pdf.setFontSize(12);
      pdf.setTextColor('#2c3e50');
      pdf.text(`${workout.type}:`, 40, y);
      pdf.text(`${workout.sessions} sessions (${workout.caloriesBurned} kcal)`, 200, y);
      y += 20;
    });
    
    pdf.save('fitness_progress_report.pdf');
  };

  const renderDashboard = () => (
    <div className="dashboard">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Workouts Completed" 
              value={fitnessData.workoutsCompleted} 
              valueStyle={{ color: '#3498db' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Calories Burned" 
              value={fitnessData.caloriesBurned} 
              valueStyle={{ color: '#e74c3c' }}
              prefix={<FireOutlined />}
              suffix="kcal"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Active Days" 
              value={fitnessData.activeDays} 
              suffix={`/ ${moment().daysInMonth()}`}
              valueStyle={{ color: '#1abc9c' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Current Streak" 
              value={fitnessData.streakDays} 
              valueStyle={{ color: '#f39c12' }}
              prefix={<ThunderboltOutlined />}
              suffix="days"
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LineChartOutlined style={{ marginRight: 10, color: '#3498db' }} />
            <span>Fitness Progress</span>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownloadFitnessReport}
            style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
          >
            Download Report
          </Button>
        }
        style={{ marginTop: 24, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={5}>Workout Types</Title>
            <div style={{ marginTop: 16 }}>
              {workoutTypes.map((type, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{type.type}</Text>
                    <Text>{type.sessions} sessions</Text>
                  </div>
                  <Progress 
                    percent={Math.round((type.sessions / workoutTypes.reduce((acc, curr) => acc + curr.sessions, 0)) * 100)} 
                    strokeColor={type.color}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Calories Burned by Type</Title>
            <div style={{ marginTop: 16 }}>
              {workoutTypes.map((type, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{type.type}</Text>
                    <Text>{type.caloriesBurned} kcal</Text>
                  </div>
                  <Progress 
                    percent={Math.round((type.caloriesBurned / workoutTypes.reduce((acc, curr) => acc + curr.caloriesBurned, 0)) * 100)} 
                    strokeColor={type.color}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={5}>Next Goal</Title>
            <Card style={{ backgroundColor: '#f8f9fa' }}>
              <Row align="middle">
                <Col span={4} style={{ textAlign: 'center' }}>
                  <Progress type="circle" percent={80} width={80} strokeColor="#1abc9c" />
                </Col>
                <Col span={20} style={{ paddingLeft: 20 }}>
                  <Title level={4} style={{ margin: 0 }}>{fitnessData.nextGoal}</Title>
                  <Text type="secondary">You're making great progress! Keep going to unlock your next achievement.</Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SolutionOutlined style={{ marginRight: 10, color: '#3498db' }} />
            <span>Medical Summary</span>
          </div>
        }
        style={{ marginTop: 24, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        {localBioData ? (
          <>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Card type="inner" title="Basic Info">
                  <p><strong>Age:</strong> {localBioData.age} years</p>
                  <p><strong>Gender:</strong> {localBioData.gender.charAt(0).toUpperCase() + localBioData.gender.slice(1)}</p>
                  <p><strong>Blood Type:</strong> {localBioData.bloodType}</p>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card type="inner" title="Body Metrics">
                  <p><strong>Height:</strong> {localBioData.height} cm</p>
                  <p><strong>Weight:</strong> {localBioData.weight} kg</p>
                  <p><strong>BMI:</strong> {(localBioData.weight / Math.pow(localBioData.height / 100, 2)).toFixed(1)}</p>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card type="inner" title="Health Notes">
                  <p><strong>Allergies:</strong> {localBioData.allergies || 'None reported'}</p>
                  <p><strong>Conditions:</strong> {localBioData.medicalConditions || 'None reported'}</p>
                </Card>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={handleDownloadMedicalPDF}
                style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
              >
                Download Medical Record
              </Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 30 }}>
            <MedicineBoxOutlined style={{ fontSize: 48, color: '#3498db', marginBottom: 16 }} />
            <Title level={4}>No Medical Records Found</Title>
            <Paragraph>
              Add your medical information to see your health summary here.
            </Paragraph>
            <Button 
              type="primary" 
              onClick={() => setFormVisible(true)}
              style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
            >
              Add Medical Records
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderProfile = () => (
    <Card
      title={<span style={{ color: '#2c3e50' }}>Profile Information</span>}
      bordered={false}
      style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Avatar 
            size={100} 
            src={user?.avatar} 
            icon={<UserOutlined />}
            style={{ marginBottom: 16, backgroundColor: '#1abc9c' }}
          />
          <Title level={3} style={{ marginBottom: 0, color: '#2c3e50' }}>{user?.name}</Title>
          <Text type="secondary" style={{ color: '#7f8c8d' }}>{user?.email}</Text>
          <div style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setEditProfileVisible(true)}
              style={{ backgroundColor: '#3498db', borderColor: '#3498db', marginRight: 8 }}
            >
              Edit Profile
            </Button>
            <Button 
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log('Delete Account button clicked in profile section'); // Debug log
                handleDeleteAccount();
              }}
              loading={deleteAccountLoading}
              style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', color: '#fff' }}
            >
              Delete Account
            </Button>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <Descriptions
            bordered
            column={{ xs: 1, sm: 2 }}
            labelStyle={{ backgroundColor: '#ecf0f1', color: '#2c3e50', fontWeight: 'bold', width: '150px' }}
            contentStyle={{ color: '#2c3e50' }}
          >
            <Descriptions.Item label="Full Name">
              {user?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email Address">
              {user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {formatDate(user?.dateOfBirth)}
            </Descriptions.Item>
            <Descriptions.Item label="Member Since">
              {formatDate(user?.createdAt)}
            </Descriptions.Item>
          </Descriptions>
          
          <Divider orientation="left">Fitness Achievements</Divider>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Tag color="#1abc9c" icon={<TrophyOutlined />}>First Workout</Tag>
            <Tag color="#3498db" icon={<FireOutlined />}>Calorie Crusher</Tag>
            <Tag color="#f39c12" icon={<ThunderboltOutlined />}>5-Day Streak</Tag>
            <Tag color="#e74c3c" icon={<HeartOutlined />}>Cardio Master</Tag>
            <Tag color="#9b59b6" icon={<ClockCircleOutlined />}>Early Bird</Tag>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderMedicalRecords = () => (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SolutionOutlined style={{ marginRight: 8, fontSize: 18, color: '#3498db' }} />
          <span style={{ color: '#2c3e50' }}>Medical Records</span>
        </div>
      }
      extra={
        localBioData && (
          <Space>
            <Button
              type="primary"
              onClick={handleDownloadMedicalPDF}
              icon={<DownloadOutlined />}
              style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
            >
              Download PDF
            </Button>
            <Button 
              type="primary" 
              onClick={() => setFormVisible(true)}
              icon={<EditOutlined />}
              style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
            >
              Update
            </Button>
            <Button 
              danger
              onClick={() => {
                console.log('Delete button clicked in medical records extra section'); // Debug log
                handleDelete();
              }}
              icon={<DeleteOutlined />}
              loading={deleteLoading}
            >
              Delete
            </Button>
          </Space>
        )
      }
      bordered={false}
      style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
    >
      {localBioData ? (
        <Descriptions 
          bordered 
          column={{ xs: 1, sm: 2 }}
          labelStyle={{ 
            backgroundColor: '#ecf0f1',
            fontWeight: 500,
            color: '#2c3e50',
            width: '200px'
          }}
          contentStyle={{ color: '#2c3e50' }}
        >
          <Descriptions.Item label="Age">
            {localBioData.age} {localBioData.age === 1 ? 'year' : 'years'}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {localBioData.gender.charAt(0).toUpperCase() + localBioData.gender.slice(1)}
          </Descriptions.Item>
          <Descriptions.Item label="Height">
            {localBioData.height} cm
          </Descriptions.Item>
          <Descriptions.Item label="Weight">
            {localBioData.weight} kg
          </Descriptions.Item>
          <Descriptions.Item label="Blood Type">
            {localBioData.bloodType}
          </Descriptions.Item>
          <Descriptions.Item label="BMI">
            {(localBioData.weight / Math.pow(localBioData.height / 100, 2)).toFixed(1)}
          </Descriptions.Item>
          <Descriptions.Item label="Allergies" span={2}>
            {localBioData.allergies || 'None reported'}
          </Descriptions.Item>
          <Descriptions.Item label="Medical Conditions" span={2}>
            {localBioData.medicalConditions || 'None reported'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          background: '#ecf0f1',
          borderRadius: 8
        }}>
          <MedicineBoxOutlined style={{ fontSize: 48, color: '#3498db', marginBottom: 16 }} />
          <Title level={4} style={{ marginBottom: 8, color: '#2c3e50' }}>No Medical Records Found</Title>
          <Text type="secondary" style={{ marginBottom: 24, display: 'block', color: '#2c3e50' }}>
            You haven't added your biomedical data yet. Please click below to get started.
          </Text>
          <Button 
            type="primary" 
            size="large"
            onClick={() => setFormVisible(true)}
            icon={<EditOutlined />}
            style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
          >
            Add Medical Records
          </Button>
        </div>
      )}
    </Card>
  );

  const renderWorkouts = () => (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FireOutlined style={{ marginRight: 8, fontSize: 18, color: '#e74c3c' }} />
          <span style={{ color: '#2c3e50' }}>Workout Tracker</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadFitnessReport}
          style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
        >
          Download Report
        </Button>
      }
      bordered={false}
      style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
    >
      <Tabs defaultActiveKey="recent" type="card">
        <TabPane tab="Recent Workouts" key="recent">
          {recentWorkouts.map((workout, index) => (
            <Card 
              key={workout.id} 
              type="inner" 
              style={{ marginBottom: 16 }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag 
                      color={
                        workout.type === 'Strength' ? '#e74c3c' : 
                        workout.type === 'Cardio' ? '#3498db' : 
                        workout.type === 'Flexibility' ? '#1abc9c' : 
                        '#f39c12'
                      }
                    >
                      {workout.type}
                    </Tag>
                    <Text>{formatDate(workout.date)}</Text>
                  </Space>
                  <Space>
                    <Badge 
                      count={workout.duration} 
                      overflowCount={999} 
                      style={{ backgroundColor: '#1abc9c' }} 
                      suffix="min" 
                    />
                    <Badge 
                      count={workout.caloriesBurned} 
                      overflowCount={9999} 
                      style={{ backgroundColor: '#e74c3c' }} 
                      suffix="kcal" 
                    />
                  </Space>
                </div>
              }
            >
              <div style={{ paddingLeft: 20 }}>
                {workout.exercises.map((exercise, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <Text strong>{exercise.name}: </Text>
                    {workout.type === 'Cardio' ? (
                      <Text>
                        {exercise.duration} min, {exercise.distance} km
                        {exercise.speed && `, Speed: ${exercise.speed} km/h`}
                        {exercise.intensity && `, Intensity: ${exercise.intensity}/10`}
                      </Text>
                    ) : (
                      <Text>
                        {exercise.sets} sets x {exercise.reps} reps
                        {exercise.weight && `, Weight: ${exercise.weight} kg`}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" size="small" style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="primary" style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}>
              View All Workouts
            </Button>
          </div>
        </TabPane>
        
        <TabPane tab="Upcoming Classes" key="classes">
          {upcomingClasses.map(classItem => (
            <Card key={classItem.id} type="inner" style={{ marginBottom: 16 }}>
              <Row align="middle">
                <Col xs={24} sm={16}>
                  <Title level={5} style={{ margin: 0 }}>{classItem.name}</Title>
                  <Text type="secondary">
                    {formatDate(classItem.date)} at {classItem.time} • {classItem.duration} min • with {classItem.instructor}
                  </Text>
                </Col>
                <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
                  <Space>
                    <Badge 
                      count={classItem.spotsRemaining} 
                      style={{ backgroundColor: classItem.spotsRemaining <= 3 ? '#e74c3c' : '#1abc9c' }} 
                      overflowCount={99}
                      suffix="spots" 
                    />
                    <Button type="primary" style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}>
                      Book
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="primary" style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}>
              Browse All Classes
            </Button>
          </div>
        </TabPane>
        
        <TabPane tab="Schedule" key="schedule">
          <Calendar 
            fullscreen={false}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const current = value.clone();
              const month = current.format('MMMM YYYY');
              
              return (
                <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={() => onChange(current.clone().subtract(1, 'month'))}>Previous</Button>
                  <Title level={4} style={{ margin: 0 }}>{month}</Title>
                  <Button onClick={() => onChange(current.clone().add(1, 'month'))}>Next</Button>
                </div>
              );
            }}
            dateCellRender={(date) => {
              // Check if date has a workout or class
              const hasWorkout = recentWorkouts.some(w => moment(w.date).isSame(date, 'day'));
              const hasClass = upcomingClasses.some(c => moment(c.date).isSame(date, 'day'));
              
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {hasWorkout && <Tag color="#e74c3c" style={{ margin: 0 }}>Workout</Tag>}
                  {hasClass && <Tag color="#3498db" style={{ margin: 0 }}>Class</Tag>}
                </div>
              );
            }}
          />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button 
              type="primary" 
              icon={<FireOutlined />} 
              style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c' }}
            >
              Add New Workout
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#2c3e50', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center',
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title 
              level={3} 
              style={{ 
                color: '#fff', 
                margin: 0,
                marginRight: 48
              }}
            >
              FitnessPro
            </Title>
            
            {!collapsed && (
              <Search
                placeholder="Search workouts, exercises, classes..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                loading={searchLoading}
                style={{ width: 300 }}
              />
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={3} dot>
              <Button 
                type="text" 
                icon={<BellOutlined style={{ color: '#fff', fontSize: 18 }} />}
                style={{ marginRight: 8 }}
              />
            </Badge>
            
            <Tooltip title={user?.name || "User"}>
              <Avatar 
                size="large" 
                src={user?.avatar} 
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: '#1abc9c',
                  cursor: 'pointer'
                }}
              />
            </Tooltip>
          </div>
        </div>
      </Header>
      
      <Layout style={{ marginTop: 64 }}>
        <Sider
          width={220}
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
            background: '#fff',
            overflow: 'auto',
            position: 'fixed',
            height: 'calc(100vh - 64px)',
            zIndex: 999
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            style={{ 
              height: '100%', 
              borderRight: 0, 
              padding: '24px 0'
            }}
            onSelect={({ key }) => setActiveTab(key)}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: '#3498db' }} />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined style={{ color: '#3498db' }} />}>
              Profile
            </Menu.Item>
            <Menu.Item key="workouts" icon={<FireOutlined style={{ color: '#e74c3c' }} />}>
              Workouts
            </Menu.Item>
            <Menu.Item key="medical" icon={<MedicineBoxOutlined style={{ color: '#3498db' }} />}>
              Medical Records
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined style={{ color: '#3498db' }} />}>
              Settings
            </Menu.Item>
            <Menu.Item 
              key="logout" 
              icon={<LogoutOutlined style={{ color: '#e74c3c' }} />}
              onClick={logout}
              style={{ color: '#e74c3c', position: 'absolute', bottom: 40, width: '100%' }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Content style={{ 
          margin: '24px 24px 24px', 
          padding: 24, 
          background: '#ecf0f1',
          marginLeft: collapsed ? 100 : 220,
          transition: 'margin-left 0.2s'
        }}>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'medical' && renderMedicalRecords()}
          {activeTab === 'workouts' && renderWorkouts()}
          {activeTab === 'settings' && (
            <Card title="Settings" style={{ borderRadius: 8 }}>
              <p>Settings page coming soon.</p>
            </Card>
          )}
        </Content>
      </Layout>
      
      <Modal
        title={localBioData ? "Update Medical Records" : "Add Medical Records"}
        open={formVisible}
        onCancel={handleBioFormCancel}
        footer={null}
        width={800}
        destroyOnClose
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onBioFormFinish}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  { 
                    required: true, 
                    message: 'Please input your age' 
                  },
                  { 
                    type: 'number',
                    min: 1,
                    max: 120,
                    message: 'Age must be between 1 and 120',
                    transform: value => Number(value)
                  }
                ]}
              >
                <Input type="number" style={{ borderColor: '#3498db' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Select style={{ borderColor: '#3498db' }}>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="height"
                label="Height (cm)"
                rules={[
                  { 
                    required: true, 
                    message: 'Please input your height' 
                  },
                  { 
                    type: 'number',
                    min: 50,
                    max: 300,
                    message: 'Height must be between 50cm and 300cm',
                    transform: value => Number(value)
                  }
                ]}
              >
                <Input type="number" style={{ borderColor: '#3498db' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Weight (kg)"
                rules={[
                  { 
                    required: true, 
                    message: 'Please input your weight' 
                  },
                  { 
                    type: 'number',
                    min: 2,
                    max: 500,
                    message: 'Weight must be between 2kg and 500kg',
                    transform: value => Number(value)
                  }
                ]}
              >
                <Input type="number" style={{ borderColor: '#3498db' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="bloodType"
            label="Blood Type"
            rules={[{ required: true, message: 'Please select your blood type' }]}
          >
            <Select style={{ borderColor: '#3498db' }}>
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>

          <Form.Item name="allergies" label="Allergies (if any)">
            <TextArea rows={2} placeholder="List any allergies you have" style={{ borderColor: '#3498db' }} />
          </Form.Item>

          <Form.Item name="medicalConditions" label="Medical Conditions (if any)">
            <TextArea rows={2} placeholder="List any medical conditions you have" style={{ borderColor: '#3498db' }} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', backgroundColor: '#3498db', borderColor: '#3498db' }}
            >
              {localBioData ? "Update Records" : "Save Records"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Profile"
        open={editProfileVisible}
        onCancel={handleProfileFormCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={onProfileFormFinish}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input style={{ borderColor: '#3498db' }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input style={{ borderColor: '#3498db' }} />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
          >
            <DatePicker 
              style={{ width: '100%', borderColor: '#3498db' }} 
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', backgroundColor: '#3498db', borderColor: '#3498db' }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Footer style={{ textAlign: 'center', background: '#ecf0f1' }}>
        FitnessPro ©{new Date().getFullYear()} Created by FitnessPro Team
      </Footer>
    </Layout>
  );
};


export default ProfilePage;