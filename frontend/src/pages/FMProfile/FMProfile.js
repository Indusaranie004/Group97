import React, { useEffect, useState } from "react";

const FMProfile = () => {
    const [manager, setManager] = useState(null);
    const managerId = "67e4c5c77c50266b3020d6ea"; //Next:67e4bc07705ead074d5a2458

    useEffect(() => {
        fetch(`http://localhost:5001/FinMngSignUp/${managerId}`) 
            .then(response => response.json())
            .then(data => setManager(data.FM))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const updateManager = () => {
        fetch(`http://localhost:5001/FinMngSignUp/${managerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                FullName: "Updated Name",
                Email: "updatedemail@example.com",
                UserName: "updatedusername",
                PhoneNo: "1234567890",
                Role: "Updated Role",
                Joined_Date: "2025-01-01",
            }),
        })
        .then(response => response.json())
        .then(data => {
            setManager(data.FM);
            alert("Manager updated successfully");
        })
        .catch(error => console.error("Error updating data:", error));
    };

    const deleteManager = () => {
        fetch(`http://localhost:5001/FinMngSignUp/${managerId}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            alert("Manager deleted successfully");
        })
        .catch(error => console.error("Error deleting data:", error));
    };

    if (!manager) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Financial Manager Profile</h2>
            <p><strong>Full Name:</strong> {manager.FullName}</p>
            <p><strong>Email:</strong> {manager.Email}</p>
            <p><strong>Username:</strong> {manager.UserName}</p>
            <p><strong>Phone Number:</strong> {manager.PhoneNo}</p>
            <p><strong>Role:</strong> {manager.Role}</p>
            <p><strong>Joined Date:</strong> {manager.Joined_Date}</p>

            {/* Update and Delete Buttons */}
            <button 
                style={{ margin: "10px", padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}
                onClick={updateManager}
            >
                Edit
            </button>
            
            <button 
                style={{ margin: "10px", padding: "10px 20px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
                onClick={deleteManager}
            >
                Delete Account
            </button>
        </div>
    );
};

export default FMProfile;
