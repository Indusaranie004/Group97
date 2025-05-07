import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Typography, 
  Card, 
  message, 
  Input, 
  Button, 
  Space, 
  Row, 
  Col,
  Tooltip,
  Tag,
  Popconfirm,
  Badge,
  Modal,
  Form,
  Select,
  DatePicker,
  Divider,
  Descriptions,
  Tabs
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  UserOutlined, 
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm] = Form.useForm();
  
  // Delete loading state
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const navigate = useNavigate();

  // Generate demo users for testing
  const generateDemoUsers = () => {
    return [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        dateOfBirth: '1985-06-15',
        createdAt: '2023-01-10',
        address: '123 Main St, New York, NY',
        phoneNumber: '(555) 123-4567',
        emergencyContact: 'Jane Doe',
        emergencyPhone: '(555) 987-6543',
        membershipType: 'Premium',
        memberSince: '2022-03-15'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'user',
        dateOfBirth: '1990-03-22',
        createdAt: '2023-02-05',
        address: '456 Park Ave, Boston, MA',
        phoneNumber: '(555) 234-5678',
        emergencyContact: 'John Smith',
        emergencyPhone: '(555) 876-5432',
        membershipType: 'Standard',
        memberSince: '2022-05-20'
      },
      {
        _id: '3',
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        role: 'user',
        dateOfBirth: '1978-11-30',
        createdAt: '2023-03-18',
        address: '789 Oak St, Chicago, IL',
        phoneNumber: '(555) 345-6789',
        emergencyContact: 'Sarah Johnson',
        emergencyPhone: '(555) 765-4321',
        membershipType: 'Premium',
        memberSince: '2022-01-10'
      },
      {
        _id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'user',
        dateOfBirth: '1992-09-12',
        createdAt: '2023-02-27',
        address: '321 Pine St, Seattle, WA',
        phoneNumber: '(555) 456-7890',
        emergencyContact: 'Michael Davis',
        emergencyPhone: '(555) 654-3210',
        membershipType: 'Basic',
        memberSince: '2022-06-05'
      },
      {
        _id: '5',
        name: 'Michael Wilson',
        email: 'michael.w@example.com',
        role: 'admin',
        dateOfBirth: '1982-04-25',
        createdAt: '2023-01-15',
        address: '654 Elm St, San Francisco, CA',
        phoneNumber: '(555) 567-8901',
        emergencyContact: 'Lisa Wilson',
        emergencyPhone: '(555) 543-2109',
        membershipType: 'Premium',
        memberSince: '2021-12-01'
      }
    ];
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users...');
      
      // Try to fetch from API
      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log(`Fetched ${data.length} users from API`);
          setUsers(data);
          setFilteredUsers(data);
          return;
        }
      } catch (apiError) {
        console.log('API fetch failed, using demo data', apiError);
      }
      
      // Fallback to demo data
      const demoData = generateDemoUsers();
      console.log(`Using ${demoData.length} demo users`);
      setUsers(demoData);
      setFilteredUsers(demoData);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Check admin permissions and load users
  useEffect(() => {
    // For demo, no need to check admin role
    // if (user && user.role !== 'admin') {
    //   message.error('Access denied. Admin only.');
    //   navigate('/profile');
    //   return;
    // }

    fetchUsers();
  }, [navigate]);

  // Handle search functionality
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    
    const filtered = users.filter(record => {
      const value = record[dataIndex];
      if (!value) return false;
      
      return value.toString().toLowerCase().includes(selectedKeys[0].toLowerCase());
    });
    
    setFilteredUsers(filtered);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
    setFilteredUsers(users);
  };

  // Global search across all fields
  const handleGlobalSearch = (value) => {
    const searchValue = value.toLowerCase();
    
    if (searchValue === '') {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(record => {
      return (
        (record.name && record.name.toLowerCase().includes(searchValue)) ||
        (record.email && record.email.toLowerCase().includes(searchValue)) ||
        (record.role && record.role.toLowerCase().includes(searchValue))
      );
    });
    
    setFilteredUsers(filtered);
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      // Try using moment first
      const momentDate = moment(dateString);
      if (momentDate.isValid()) {
        return momentDate.format('MMMM D, YYYY');
      }
      
      // Fallback to native Date 
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
      console.error('Error formatting date:', error, 'for date string:', dateString);
      return 'Not available';
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    try {
      setPdfLoading(true);
      console.log('Generating PDF...');
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor('#2c3e50');
      doc.text('FitnessPro - User Management Report', 14, 20);
      
      // Add report generation info
      doc.setFontSize(10);
      doc.setTextColor('#7f8c8d');
      doc.text(`Generated: ${new Date().toLocaleDateString()} by ${user?.name || 'Admin'}`, 14, 30);
      
      // Add total count
      doc.setFontSize(12);
      doc.setTextColor('#2c3e50');
      doc.text(`Total Users: ${filteredUsers.length}`, 14, 40);
      
      // Create table
      const tableColumn = ["Name", "Email", "Role", "Date of Birth"];
      const tableRows = [];

      filteredUsers.forEach(user => {
        const userData = [
          user.name || '',
          user.email || '',
          user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '',
          formatDate(user.dateOfBirth)
        ];
        tableRows.push(userData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [235, 237, 239] },
        margin: { top: 20, bottom: 20 }
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#95a5a6');
        doc.text('FitnessPro © ' + new Date().getFullYear() + ' - Confidential', 14, doc.internal.pageSize.height - 10);
        doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      
      doc.save('user_management_report.pdf');
      message.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('Failed to generate PDF report');
    } finally {
      setPdfLoading(false);
    }
  };

  // Define column search props for filtering
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, backgroundColor: '#3498db', borderColor: '#3498db' }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#3498db' : undefined }} />,
    onFilter: (value, record) => {
      if (!record[dataIndex]) return false;
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    },
    render: text => (
      searchedColumn === dataIndex ? (
        <span style={{ fontWeight: searchText && text.toString().toLowerCase().includes(searchText.toLowerCase()) ? 'bold' : 'normal' }}>
          {text}
        </span>
      ) : text
    ),
  });

  // Handle view user details
  const handleViewUser = (record) => {
    console.log('View user:', record);
    setCurrentUser(record);
    setViewModalVisible(true);
  };

  // Handle edit user
  const handleEditUser = (record) => {
    console.log('Edit user:', record);
    setCurrentUser(record);
    setEditModalVisible(true);
    
    // Set form values
    editForm.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      dateOfBirth: record.dateOfBirth ? moment(record.dateOfBirth) : null,
      address: record.address,
      phoneNumber: record.phoneNumber,
      emergencyContact: record.emergencyContact,
      emergencyPhone: record.emergencyPhone,
      membershipType: record.membershipType
    });
  };

  // Handle delete user
  const handleDeleteUser = async (record) => {
    console.log('Delete user:', record);
    setDeleteLoading(true);
    
    try {
      // API call would go here
      // const response = await fetch(`/api/users/${record._id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove user from list
      const updatedUsers = users.filter(user => user._id !== record._id);
      setUsers(updatedUsers);
      setFilteredUsers(filteredUsers.filter(user => user._id !== record._id));
      
      message.success(`User ${record.name} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit form submission
  const handleEditFormSubmit = async (values) => {
    console.log('Form values:', values);
    
    try {
      setLoading(true);
      
      // Format the date
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined
      };
      
      // API call would go here
      // const response = await fetch(`/api/users/${currentUser._id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: JSON.stringify(formattedValues),
      // });
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user in list
      const updatedUsers = users.map(user => {
        if (user._id === currentUser._id) {
          return {
            ...user,
            ...formattedValues
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(
        filteredUsers.map(user => {
          if (user._id === currentUser._id) {
            return {
              ...user,
              ...formattedValues
            };
          }
          return user;
        })
      );
      
      message.success(`User ${formattedValues.name} updated successfully`);
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      ...getColumnSearchProps('role'),
      render: (role) => (
        <Tag color={role === 'admin' ? '#1abc9c' : '#3498db'}>
          {role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}
        </Tag>
      ),
      sorter: (a, b) => (a.role || '').localeCompare(b.role || ''),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => formatDate(date),
      sorter: (a, b) => {
        if (!a.dateOfBirth && !b.dateOfBirth) return 0;
        if (!a.dateOfBirth) return -1;
        if (!b.dateOfBirth) return 1;
        return new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EyeOutlined />} 
              size="small"
              style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EditOutlined />} 
              size="small"
              style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' } }}
            >
              <Button 
                type="primary" 
                danger 
                shape="circle" 
                icon={<DeleteOutlined />} 
                size="small"
                style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c' }}
                loading={deleteLoading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Banner for demo mode */}
      <Card
        style={{
          margin: '24px 24px 0 24px',
          borderRadius: 8,
          backgroundColor: '#1abc9c',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <InfoCircleOutlined style={{ fontSize: 20, color: 'white' }} />
            <Title level={4} style={{ margin: 0, color: 'white' }}>Admin Dashboard</Title>
          </Space>
          <Text style={{ color: 'white' }}>
            User Management Interface with View, Edit, and Delete functionality
          </Text>
        </div>
      </Card>
      
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <UserOutlined style={{ fontSize: 24, color: '#3498db' }} />
              <Title level={3} style={{ color: '#2c3e50', margin: 0 }}>User Management</Title>
              <Badge count={filteredUsers.length} style={{ backgroundColor: '#1abc9c' }} />
            </Space>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
                loading={loading}
                style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={generatePDF}
                loading={pdfLoading}
                style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
              >
                Export PDF
              </Button>
            </Space>
          </div>
        }
        style={{
          margin: '24px',
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8} lg={6}>
            <Search
              placeholder="Search users..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleGlobalSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={16} lg={18}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Text>
                  Showing <Text strong>{filteredUsers.length}</Text> of <Text strong>{users.length}</Text> users
                </Text>
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={() => setFilteredUsers(users)}
                  disabled={filteredUsers.length === users.length}
                >
                  Clear Filters
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users` 
          }}
          style={{ backgroundColor: '#fff' }}
          scroll={{ x: 'max-content' }}
          onChange={(pagination, filters, sorter) => {
            console.log('Table params:', { pagination, filters, sorter });
          }}
        />
      </Card>

      {/* View User Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ fontSize: 20, color: '#3498db', marginRight: 10 }} />
            <span>User Details</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleEditUser(currentUser);
            }}
            style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
          >
            Edit
          </Button>
        ]}
        width={800}
      >
        {currentUser && (
          <Tabs defaultActiveKey="1">
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  Basic Information
                </span>
              } 
              key="1"
            >
              <Descriptions bordered column={1} labelStyle={{ width: '200px' }}>
                <Descriptions.Item label="Name">
                  <Space>
                    <UserOutlined style={{ color: '#3498db' }} />
                    {currentUser.name}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Space>
                    <MailOutlined style={{ color: '#3498db' }} />
                    {currentUser.email}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={currentUser.role === 'admin' ? '#1abc9c' : '#3498db'}>
                    {currentUser.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : ''}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  <Space>
                    <CalendarOutlined style={{ color: '#3498db' }} />
                    {formatDate(currentUser.dateOfBirth)}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {currentUser.address || 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {currentUser.phoneNumber || 'Not provided'}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <IdcardOutlined />
                  Membership
                </span>
              } 
              key="2"
            >
              <Descriptions bordered column={1} labelStyle={{ width: '200px' }}>
                <Descriptions.Item label="Membership Type">
                  <Tag color={
                    currentUser.membershipType === 'Premium' ? '#1abc9c' : 
                    currentUser.membershipType === 'Standard' ? '#3498db' : '#7f8c8d'
                  }>
                    {currentUser.membershipType || 'Basic'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Member Since">
                  {formatDate(currentUser.memberSince)}
                </Descriptions.Item>
                <Descriptions.Item label="Account Created">
                  {formatDate(currentUser.createdAt)}
                </Descriptions.Item>
              </Descriptions>
              
              <Divider />
              
              <Descriptions bordered column={1} labelStyle={{ width: '200px' }}>
                <Descriptions.Item label="Emergency Contact">
                  {currentUser.emergencyContact || 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Phone">
                  {currentUser.emergencyPhone || 'Not provided'}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EditOutlined style={{ fontSize: 20, color: '#1abc9c', marginRight: 10 }} />
            <span>Edit User</span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditFormSubmit}
          initialValues={{
            role: 'user',
            membershipType: 'Basic'
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  Basic Information
                </span>
              } 
              key="1"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter name' }]}
                  >
                    <Input prefix={<UserOutlined style={{ color: '#3498db' }} />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined style={{ color: '#3498db' }} />} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select role' }]}
                  >
                    <Select prefix={<TeamOutlined />}>
                      <Option value="admin">Admin</Option>
                      <Option value="user">User</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="address"
                label="Address"
              >
                <Input.TextArea rows={2} />
              </Form.Item>
              
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
              >
                <Input />
              </Form.Item>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <IdcardOutlined />
                  Membership
                </span>
              } 
              key="2"
            >
              <Form.Item
                name="membershipType"
                label="Membership Type"
              >
                <Select>
                  <Option value="Basic">Basic</Option>
                  <Option value="Standard">Standard</Option>
                  <Option value="Premium">Premium</Option>
                </Select>
              </Form.Item>
              
              <Divider orientation="left">Emergency Contact Information</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="emergencyContact"
                    label="Emergency Contact Name"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="emergencyPhone"
                    label="Emergency Contact Phone"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <LockOutlined />
                  Account Security
                </span>
              } 
              key="3"
            >
              <Paragraph>
                <Text strong>Note:</Text> For security reasons, password changes should be handled through a separate form with appropriate validation.
              </Paragraph>
              
              <Form.Item label="Reset Password">
                <Button 
                  type="primary" 
                  danger
                  onClick={() => message.info("Password reset functionality would be implemented here")}
                >
                  Send Password Reset Link
                </Button>
              </Form.Item>
              
              <Form.Item label="Account Status">
                <Select defaultValue="active">
                  <Option value="active">Active</Option>
                  <Option value="suspended">Suspended</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </TabPane>
          </Tabs>
          
          <Divider />
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                style={{ backgroundColor: '#1abc9c', borderColor: '#1abc9c' }}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminUsers;