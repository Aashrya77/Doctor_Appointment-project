import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Patient",
    gender: "Male",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [longWait, setLongWait] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const waitTimer = setTimeout(() => {
      setLongWait(true);
    }, 3000);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister
        ? "https://doctor-appointment-backend-tim3.onrender.com/api/v1/auth/register"
        : "https://doctor-appointment-backend-tim3.onrender.com/api/v1/auth/login";
  
      const { data } = await axios.post(endpoint, formData);
      clearTimeout(waitTimer);
      const { token, role } = data;
  
      localStorage.setItem("token", token);
      if (role === "Doctor") {
        navigate("/dashboard");  // Doctor's Dashboard
      } else if (role === "Patient") {
        navigate("/patient-dashboard");  // Patient's Dashboard
      } else {
        setError("Unknown user role.");
      }
    } catch (err) {
      setError("Invalid credentials or server error");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isRegister ? "Register" : "Login"}</h2>
        {error && <p className="auth-error">{error}</p>}
         {longWait && <p className="auth-wait-message">Please wait...</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          {isRegister && (
            <>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </>
          )}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className="auth-toggle">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="auth-link"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
