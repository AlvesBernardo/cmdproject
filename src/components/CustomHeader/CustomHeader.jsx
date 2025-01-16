import {MdOutlineDashboard} from "react-icons/md";
import CustomButton from "../CustomButton/CustomButton.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import TokenManager from "../../helpers/TokenManager.js";

const CustomHeader = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState();
    const [userName, setUserName] = useState();

    useEffect(() => {
        const userName = TokenManager.getUserName()
        const userEmail = TokenManager.getUserEmail()

        setUserEmail(userEmail)
        setUserName(userName)
    }, [])

    const toDashboard = () => {
        if (TokenManager.getUserRole() === 'true') {
            navigate("/adminDashboard")
        } else {
            navigate("/studentDashboard")
        }
    }

    return (
        <div className={"customHeaderContainer"}>
            <div className={"profileContainer"}>
                <img src={`../../public/images/nhlLogo.png`} alt="" className={"w-20 h-20 rounded-full"}/>

                <div className={"profileDetailsContainer"}>
                    <h5>{userName}</h5>
                    <h5>{userEmail}</h5>
                </div>

            </div>
            <div className={"dashboardButtonContainer"}>
                <CustomButton text={"Dashboard"} color={"secondary"} width={'200px'} onClick={toDashboard}>
                    <MdOutlineDashboard/>
                </CustomButton>
            </div>

        </div>
    )
}
export default CustomHeader
