import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HRDashboard.css';

function HRDashboard() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showCoachModal, setShowCoachModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Form states
    const [memberForm, setMemberForm] = useState({
        fullname: '',
        email: '',
        role: '',
        phone: ''
    });
    
    const [coachForm, setCoachForm] = useState({
        fullname: '',
        email: '',
        specialization: '',
        experience: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedInUser = JSON.parse(localStorage.getItem('user'));
                if (!loggedInUser) {
                    navigate('/login');
                    return;
                }

                const membersRes = await axios.get('http://localhost:5000/users');
                const coachesRes = await axios.get('http://localhost:5000/coaches');
                
                setMembers(membersRes.data);
                setCoaches(coachesRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [navigate]);

    const filteredMembers = members.filter(member => 
        member.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCoaches = coaches.filter(coach => 
        coach.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coach.specialization && coach.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Member CRUD Operations
    const handleMemberInputChange = (e) => {
        const { name, value } = e.target;
        setMemberForm({
            ...memberForm,
            [name]: value
        });
    };

    const handleCoachInputChange = (e) => {
        const { name, value } = e.target;
        setCoachForm({
            ...coachForm,
            [name]: value
        });
    };

    const addMember = async () => {
        try {
            const res = await axios.post('http://localhost:5000/users', memberForm);
            setMembers([...members, res.data]);
            setMemberForm({ fullname: '', email: '' });
            setShowMemberModal(false);
        } catch (err) {
            setError('Failed to add member');
            console.error(err);
        }
    };

    const updateMember = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/users/${currentItem._id}`, memberForm);
            setMembers(members.map(member => member._id === currentItem._id ? res.data : member));
            setShowMemberModal(false);
            setEditMode(false);
            setCurrentItem(null);
        } catch (err) {
            setError('Failed to update member');
            console.error(err);
        }
    };

    const deleteMember = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            setMembers(members.filter(member => member._id !== id));
        } catch (err) {
            setError('Failed to delete member');
            console.error(err);
        }
    };

    // Coach CRUD Operations
    const addCoach = async () => {
        try {
            const res = await axios.post('http://localhost:5000/coaches', coachForm);
            setCoaches([...coaches, res.data]);
            setCoachForm({ fullname: '', email: ''});
            setShowCoachModal(false);
        } catch (err) {
            setError('Failed to add coach');
            console.error(err);
        }
    };

    const updateCoach = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/coaches/${currentItem._id}`, coachForm);
            setCoaches(coaches.map(coach => coach._id === currentItem._id ? res.data : coach));
            setShowCoachModal(false);
            setEditMode(false);
            setCurrentItem(null);
        } catch (err) {
            setError('Failed to update coach');
            console.error(err);
        }
    };

    const deleteCoach = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/coaches/${id}`);
            setCoaches(coaches.filter(coach => coach._id !== id));
        } catch (err) {
            setError('Failed to delete coach');
            console.error(err);
        }
    };

    // Edit handlers
    const handleEditMember = (member) => {
        setMemberForm({
            fullname: member.fullname,
            email: member.email,
           
        });
        setCurrentItem(member);
        setEditMode(true);
        setShowMemberModal(true);
    };

    const handleEditCoach = (coach) => {
        setCoachForm({
            fullname: coach.fullname,
            email: coach.email,
          
        });
        setCurrentItem(coach);
        setEditMode(true);
        setShowCoachModal(true);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="hr-dashboard">
            <div className="header">
                <button onClick={() => navigate(-1)} className="back-btn">Back</button>
                <h1>HR Manager Dashboard</h1>
                <button onClick={() => navigate('/profile')} className="profile-btn">My Profile</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search members or coaches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="grid-container">
                <div className="members-grid">
                    <div className="section-header">
                        <h2>Members</h2>
                        <button onClick={() => { setShowMemberModal(true); setEditMode(false); setMemberForm({ fullname: '', email: '', role: '', phone: '' }); }} className="add-btn">
                            Add Member
                        </button>
                    </div>
                    <div className="grid-content">
                        {filteredMembers.map(member => (
                            <div key={member._id} className="card">
                                <h3>{member.fullname}</h3>
                                <p>Email: {member.email}</p>
                               
                                <div className="card-actions">
                                    <button onClick={() => handleEditMember(member)} className="edit-btn">Edit</button>
                                    <button onClick={() => deleteMember(member._id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="coaches-grid">
                    <div className="section-header">
                        <h2>Coaches</h2>
                        <button onClick={() => { setShowCoachModal(true); setEditMode(false); setCoachForm({ fullname: '', email: '', specialization: '', experience: '' }); }} className="add-btn">
                            Add Coach
                        </button>
                    </div>
                    <div className="grid-content">
                        {filteredCoaches.map(coach => (
                            <div key={coach._id} className="card">
                                <h3>{coach.fullname}</h3>
                                <p>Email: {coach.email}</p>
                                
                                <div className="card-actions">
                                    <button onClick={() => handleEditCoach(coach)} className="edit-btn">Edit</button>
                                    <button onClick={() => deleteCoach(coach._id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Member Modal */}
            {showMemberModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowMemberModal(false)}>&times;</span>
                        <h2>{editMode ? 'Edit Member' : 'Add New Member'}</h2>
                        <form>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    name="fullname" 
                                    value={memberForm.fullname} 
                                    onChange={handleMemberInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={memberForm.email} 
                                    onChange={handleMemberInputChange} 
                                    required 
                                />
                            </div>
                           
                          
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowMemberModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={editMode ? updateMember : addMember} 
                                    className="submit-btn"
                                >
                                    {editMode ? 'Update' : 'Add'} Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Coach Modal */}
            {showCoachModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowCoachModal(false)}>&times;</span>
                        <h2>{editMode ? 'Edit Coach' : 'Add New Coach'}</h2>
                        <form>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    name="fullname" 
                                    value={coachForm.fullname} 
                                    onChange={handleCoachInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={coachForm.email} 
                                    onChange={handleCoachInputChange} 
                                    required 
                                />
                            </div>
                           
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowCoachModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={editMode ? updateCoach : addCoach} 
                                    className="submit-btn"
                                >
                                    {editMode ? 'Update' : 'Add'} Coach
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HRDashboard;