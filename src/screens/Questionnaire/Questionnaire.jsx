import React, { useState, useEffect, useRef } from "react";
import "../../css/screens/_questionnaire.scss";
import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import TokenManager from "../../helpers/TokenManager";
import { MdOutlineDashboard } from "react-icons/md";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../helpers/AxiosInstance.js";

function DraggableItem({ text, onDragStart, isDropped }) {
  const itemRef = useRef(null);
  const [profile, setProfile] = useState({ dtStudentNumber: ""});


  const adjustFontSize = () => {
    const element = itemRef.current;
    if (!element) return;

    element.style.fontSize = "100px";

    const parentWidth = element.offsetWidth;
    const parentHeight = element.offsetHeight; 
    let textWidth = element.scrollWidth;
    let textHeight = element.scrollHeight;

    while (
      (textWidth > parentWidth || textHeight > parentHeight) &&
      parseFloat(element.style.fontSize) > 1
    ) {
      const currentFontSize = parseFloat(element.style.fontSize);
      element.style.fontSize = `${currentFontSize - 1}px`;
      textWidth = element.scrollWidth;
      textHeight = element.scrollHeight;
    }
  };

  useEffect(() => {
    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);

    return () => window.removeEventListener("resize", adjustFontSize);
  }, [text]);

  return (
    <div
      ref={itemRef}
      className={`draggable-item ${isDropped ? "dropped-item" : ""}`}
      draggable={!isDropped}
      onDragStart={!isDropped ? onDragStart : undefined}
    >
      {text}
    </div>
  );
}

function Questionnaire() {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState({ name: "", email: "" });
  const [draggedItem, setDraggedItem] = useState(null);
  const [choices, setChoices] = useState({ first: null, second: null, third: null });
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/questions.json")
        .then((response) => response.json())
        .then((data) => setQuestions(data));

    fetch("/user.json")
        .then((response) => response.json())
        .then((data) => setUser(data));

    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    try {
        const response = await api.get("api/v1/studios");
        console.log("Fetched studios:", response.data.data);

        const studios = response.data.data.map(studio => ({
            id: studio.idStudio,
            name: studio.dtStudioName,
            capacity: studio.dtCapacity,
            isBookable: studio.dtIsBookable
        }));

        setCourses(studios);
    } catch (err) {
        console.error("Error fetching studios:", err);
        alert("Failed to fetch courses. Please try again later.");
    }
};



  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


const handleSubmit = async () => {
  try {
      const student_id = TokenManager.getUserId();

      const answers = JSON.stringify(
          questions.map((q) => ({
              id: q.id,
              question: q.question,
              answer: q.type === "multiple-choice" ? choices : (q.answer || ""),
          }))
      );

      const payload = {
          student_id,
          answers,
          choices
      };

      console.log("Submitting payload:", payload);

      await api.post("/api/v1/answers", payload);

      alert("Your answers have been submitted successfully!");
  } catch (err) {
      console.error("Error submitting answers:", err);
      alert("Failed to submit your answers. Please try again.");
  }
};



  const onDragStart = (item) => {
    setDraggedItem(item);
  };

  const onDrop = (choice) => {
    setChoices((prev) => ({ ...prev, [choice]: draggedItem }));
    setDraggedItem(null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleClearChoice = (choice) => {
    setChoices((prev) => ({ ...prev, [choice]: null }));
  };

  const renderAvailableOptions = () => {
    const usedChoices = Object.values(choices);
    return courses
        .filter((course) => !usedChoices.includes(course.name))
        .map((course) => (
            <DraggableItem
                key={course.id}
                text={course.name}
                onDragStart={() => onDragStart(course.name)}
            />
        ));
};


  const renderDropZones = () => {
    return ["first", "second", "third"].map((choice) => (
      <div
        key={choice}
        onDrop={() => onDrop(choice)}
        onDragOver={onDragOver}
        className={`drop-zone ${choices[choice] ? "filled" : ""}`}
      >
        {choices[choice] ? (
          <div className="dropped-item">
            <DraggableItem
              text={choices[choice]}
              isDropped={true}
            />
            <button
              className="clear-choice"
              onClick={() => handleClearChoice(choice)}
            >
              X
            </button>
          </div>
        ) : (
          `${choice.charAt(0).toUpperCase() + choice.slice(1)} Choice`
        )}
      </div>
    ));
  };

  const toDashboard = () => {
    navigate("/studentDashboard");
  };

  return (
    <div className="questionnaire-container" style={{ position: "relative" }}>
      <CustomHeader/>

      {questions.length > 0 && (
        <>
          <div className="question-box">
            <h2>{questions[currentStep].question}</h2>
          </div>

          {questions[currentStep].type === "multiple-choice" ? (
            <div className="drag-and-drop-container">
              <div className="options">
                <h3>Available Options</h3>
                {renderAvailableOptions()}
              </div>
              <div className="choices">
                <h3>Your Choices</h3>
                {renderDropZones()}
              </div>
            </div>
          ) : (
            <div className="answer-box">
              <textarea
                value={questions[currentStep].answer || ""}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((q, i) =>
                      i === currentStep ? { ...q, answer: e.target.value } : q
                    )
                  )
                }
                placeholder="Enter your answer here"
              ></textarea>
            </div>
          )}

          <div className="step-indicator-box">
            <p>
              Step {currentStep + 1} out of {questions.length}
            </p>
          </div>
          <div className="navigation-buttons">
            <CustomButton text={"Previous"} color={"secondary"} width={"40%"}>
              <FaLongArrowAltLeft />
            </CustomButton>

            {currentStep < questions.length - 1 ? (
              <CustomButton text={"Next"} color={"primary"}>
                <FaLongArrowAltRight />
              </CustomButton>
            ) : (
              <CustomButton text={"Submit"} color={"primary"} onClick={handleSubmit} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Questionnaire;
