import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HRManagerProfile.css';

function HRManagerProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullname: '',
        email: '',
        username: '',
        phone: '',
        role: '',
        joinDate: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const loggedInUser = JSON.parse(localStorage.getItem('user'));
                if (!loggedInUser || !loggedInUser._id) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/profile/${loggedInUser._id}`);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setMessage('Failed to load profile. Please try again.');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!user.fullname.trim()) newErrors.fullname = "Full name is required";
        else if (user.fullname.includes('@')) newErrors.fullname = "Name cannot contain '@' symbol";
        
        if (!user.email.trim()) newErrors.email = "Email is required";
        else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) 
            newErrors.email = "Invalid email format";
            
        if (!user.username.trim()) newErrors.username = "Username is required";
        
        if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword) 
            newErrors.confirmPassword = "Passwords do not match";
            
        if (!user.phone.trim()) newErrors.phone = "Phone is required";
        else if (!/^[0-9]{10}$/.test(user.phone)) newErrors.phone = "Invalid phone number (10 digits required)";
        
        if (!user.role) newErrors.role = "Role is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            const updatedData = { 
                fullname: user.fullname,
                email: user.email,
                username: user.username,
                phone: user.phone,
                role: user.role
            };

            // Only add password if it was changed
            if (password) {
                updatedData.password = password;
            }

            const response = await axios.put(
                `http://localhost:5000/profile/${loggedInUser._id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update local storage with new data
            const updatedUserData = { ...loggedInUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            setUser(response.data);
            setEditMode(false);
            setPassword('');
            setConfirmPassword('');
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage(err.response?.data?.error || err.message || 'Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        
        try {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            await axios.delete(`http://localhost:5000/profile/${loggedInUser._id}`);
            
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            console.error('Error deleting profile:', err);
            setMessage(err.response?.data?.message || 'Failed to delete profile');
        }
    };

    return (
        <div className="app-container">
            <header className="main-header">
                <div className="logo">
                    <h2>HR System</h2>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><button onClick={() => navigate('/hr-dashboard')} className="nav-btn">HR Dashboard</button></li>
                        <li><button onClick={() => navigate('/payroll-dashboard')} className="nav-btn">Payroll</button></li>
                        <li className="profile-menu">
                            <span className="user-name">{user.fullname}</span>
                            <div className="dropdown-content">
                                <button onClick={() => navigate('/profile')}>My Profile</button>
                            </div>
                        </li>
                        <li>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    navigate('/login');
                                }} 
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="profile-container">
                <h1>HR Manager Profile</h1>
                
                {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                {!editMode ? (
                    <div className="profile-view">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {user.fullname ? user.fullname.charAt(0).toUpperCase() : ''}
                            </div>
                            <div className="profile-title">
                                <h2>{user.fullname}</h2>
                                <p className="role-badge">{user.role}</p>
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="profile-field">
                                <label>Email:</label>
                                <p>{user.email}</p>
                            </div>
                            <div className="profile-field">
                                <label>Username:</label>
                                <p>{user.username}</p>
                            </div>
                            <div className="profile-field">
                                <label>Phone:</label>
                                <p>{user.phone}</p>
                            </div>
                            <div className="profile-field">
                                <label>Join Date:</label>
                                <p>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="profile-actions">
                            <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
                            <button onClick={handleDelete} className="delete-btn">Delete Account</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                name="fullname"
                                value={user.fullname} 
                                onChange={handleInputChange}
                                className={errors.fullname ? 'error-input' : ''}
                            />
                            {errors.fullname && <span className="error">{errors.fullname}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={user.email} 
                                onChange={handleInputChange}
                                className={errors.email ? 'error-input' : ''}
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                name="username"
                                value={user.username} 
                                onChange={handleInputChange}
                                className={errors.username ? 'error-input' : ''}
                            />
                            {errors.username && <span className="error">{errors.username}</span>}
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={user.phone} 
                                onChange={handleInputChange}
                                className={errors.phone ? 'error-input' : ''}
                            />
                            {errors.phone && <span className="error">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <select 
                                name="role"
                                value={user.role} 
                                onChange={handleInputChange}
                                className={errors.role ? 'error-input' : ''}
                            >
                                <option value="HR Manager">HR Manager</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                            {errors.role && <span className="error">{errors.role}</span>}
                        </div>

                        <div className="form-group">
                            <label>New Password (leave blank to keep current)</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className={errors.password ? 'error-input' : ''}
                            />
                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={errors.confirmPassword ? 'error-input' : ''}
                            />
                            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default HRManagerProfile;