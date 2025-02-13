import { Link } from "react-router-dom";
import "./HomeWelcome.css";

const HomeWelcome = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome To Our Doctor's Appointment Platform</h1>
        <p className="home-description">
          Book appointments with trusted doctors easily and efficiently.
        </p>
        <Link to="/register">
          <button className="home-button">Register Now</button>
        </Link>
      </div>
    </div>
  );
};

export default HomeWelcome;
