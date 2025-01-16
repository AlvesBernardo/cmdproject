import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TokenManager from "../../helpers/TokenManager";
import {useNavigate} from "react-router-dom";
import {HiLogout} from "react-icons/hi";
import { BsQuestionSquare } from "react-icons/bs";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import { HiOutlineAnnotation } from "react-icons/hi";
import { HiMiniChartBar } from "react-icons/hi2";
import api from "../../helpers/AxiosInstance.js";

const StudentDashboard = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = TokenManager.getUserId()
        const response = await api.get(`/profile/${userId}`);
        await TokenManager.setUserName(response?.data?.dtFullName)
        await TokenManager.setUserEmail(response?.data?.dtEmail)
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    TokenManager.clearTokens();
    toast.error("You just logged out!");
    navigate('/')
  }

  const toQuestionnaire = () => {
    navigate("/questionnaire")
  }

  const toResults = () => {
    navigate("/results")
  }

  return (
    <div className="dashboard-container">
      <div className="logout-section">
        <CustomButton onClick={handleLogout} text={"Logout"} color={"error"}>
          <HiLogout className="hiLogout" />
        </CustomButton>
      </div>
      <div className="dashboard-section">
        {error ? (
          <div className="error-message">
            <p className={"text-red"}>Failed to load profile. Please try again later.</p>
          </div>
        ) : (
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={"../images/pinkBow.jpg"} alt="Profile Avatar" />
            </div>
            <h2 className="profile-name">{profile.dtFullName}</h2>
            <p className="profile-email">{profile.dtEmail}</p>
          </div>
        )}
        <div className="buttons-section">
          <CustomButton text={"Start Questionnaire"} onClick={toQuestionnaire}>
            <HiOutlineAnnotation size={28} className={"pr-2"}/>
          </CustomButton>

          <CustomButton text={"Checkout Results"} color={"secondary"} onClick={toResults}>
            <HiMiniChartBar size={25} className={"pr-2"}/>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
