import { useState } from "react";

const FinancialManagerSignup = () => {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    UserName: "",
    Password: "",
    PhoneNo: "",
    Role: "Financial Manager",
    Joined_Date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://LocalHost:5001/FinMngSignUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Sign-up successful!");
      } else {
        alert("Sign-up failed!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="FullName" placeholder="Full Name" value={formData.FullName} onChange={handleChange} required />
      <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} required />
      <input type="text" name="UserName" placeholder="Username" value={formData.UserName} onChange={handleChange} required />
      <input type="password" name="Password" placeholder="Password" value={formData.Password} onChange={handleChange} required />
      <input type="text" name="PhoneNo" placeholder="Phone Number" value={formData.PhoneNo} onChange={handleChange} required />
      <input type="text" name="Joined_Date" placeholder="Joined Date (YYYY-MM-DD)" value={formData.Joined_Date} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default FinancialManagerSignup;
