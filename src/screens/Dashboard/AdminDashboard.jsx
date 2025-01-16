import React, { useEffect, useState } from "react";
import "../../css/screens/_adminDashboard.scss";
import {HiLogout} from "react-icons/hi";
import imgPlaceholder from "../../images/pinkBow.jpg";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import { SiReasonstudios } from "react-icons/si";
import { PiStudent } from "react-icons/pi";
import {MdOutlineQuestionAnswer} from "react-icons/md";
import TokenManager from "../../helpers/TokenManager.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import api from "../../helpers/AxiosInstance.js";

const AdminDashboard = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [error, setError] = useState();

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

  const toManageStudios = () => {
    navigate('/manageStudios')
  }

  const toStudentList = () => {
    navigate('/studentList')
  }

  const toResults = () => {
    navigate('/adminResults')
  }

  return (
    <div className="dashboard-container">
      <div className="logout-section">
        <CustomButton onClick={handleLogout} text={"Logout"} color={"error"}>
          <HiLogout className={"hiLogout"} />
        </CustomButton>
      </div>
      <div className="dashboard-section">
        {error ? (
          <div className="error-message">
            <p>Failed to load profile. Please try again later.</p>
          </div>
        ) : (
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={imgPlaceholder} alt="Profile Avatar" />
            </div>
            <h2 className="profile-name">{profile.dtFullName}</h2>
            <p className="profile-email">{profile.dtEmail}</p>
          </div>
        )}
        <div className="buttons-section">
          <CustomButton text={"Manage Studios"} onClick={toManageStudios}>
            <SiReasonstudios size={27} className={"pr-1"}/>
          </CustomButton>

          <CustomButton text={"Student list"} color={"secondary"} onClick={toStudentList}>
            <PiStudent size={27} className={"pr-1"}/>
          </CustomButton>
        </div>
        <div className="second-button-line-section">
          <CustomButton text={"Results"} color={"secondary"} onClick={toResults}>
            <MdOutlineQuestionAnswer size={27} className={"pr-1"}/>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
