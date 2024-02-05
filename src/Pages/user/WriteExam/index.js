import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../Apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { addReport } from "../../../Apicalls/reports";

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });

      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
        setQuestions(response.data.questions);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });
      let verdict = "pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };

      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.successs) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    const totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        // totalSeconds = totalSeconds-1;
        // setSecondsLeft(totalSeconds);
        setSecondsLeft((prev) => prev - 1);
      } else {
        // setTimeUp(true);
        clearInterval(intervalId);
        setTimeUp(true);
        calculateResult();
      }
    }, 1000);
    setIntervalId(intervalId);
  };
  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between ">
              <h1 className="text-2xl">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex].name}
              </h1>
              <div className="timer">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xl">
                        {option}:{" "}
                        {questions[selectedQuestionIndex].options[option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}
              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    clearInterval(intervalId);
                    // setTimeUp(true);
                    calculateResult();
                    setView("result");
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
        {/* this section is recheck */}

        {view === "result" && (
          <div className="flex  items-center mt-2 justify-center">
            <div className="flex flex-col gap-2 result">
              <h1 className="text-2xl">Result</h1>
              <div className="divider"></div>

              <div className="marks">
                <h1 className="text-md">Total Marks:- {examData.totalMarks}</h1>
                <h1 className="text-md">
                  Obtained Marks:-
                  {result.correctAnswers.length}
                </h1>
                <h1 className="text-md">
                  Wrong Answers:-
                  {result.wrongAnswers.length}
                </h1>

                <h1 className="text-md">
                  Passing Marks:-
                  {examData.passingMarks}
                </h1>

                <h1 className="text-md"> VERDICT:-{result.verdict}</h1>
                {/* review code  */}
                <div className="flex gap-3 mt-2">
                  <button
                    className="primary-contained-btn"
                    onClick={() => {
                      setView("instructions");
                      setSelectedQuestionIndex(0);
                      setSelectedOptions({});
                      setSecondsLeft(examData.duration);
                      // startTimer();
                    }}
                  >
                    Retake
                  </button>

                  <button
                    className="primary-contained-btn"
                    onClick={() => {
                      setView("review");
                    }}
                  >
                    Review
                  </button>
                </div>
                {/* end code */}
              </div>
            </div>
            <div className="lottie-animation">
              {result.verdict === "pass" && (
                <dotlottie-player
                  src="https://lottie.host/765f8948-faba-4d2d-a99a-2c5f14168ca1/lZBqlFcgfI.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></dotlottie-player>
              )}
              {result.verdict === "fail" && (
                <dotlottie-player
                  src="https://lottie.host/343af260-0de4-4f09-9a51-ec9a19b1a742/smP4y8wpXI.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></dotlottie-player>
              )}
              {/* end */}
            </div>
          </div>
        )}
{/* Review exam section code */}
        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`flex flex-col gap-2 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                >
                  <h1 className="text-xl">
                    {index + 1}:{question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer:{selectedOptions[index]}-
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer :{question.correctOption}-
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}
{/* end review section */}





            {/* retake exam */}
            {/* <div className="flex justify-center gap-2">
         <button className="primary-outlined-btn"
          onClick={()=>{
           navigate("/");
          }}>close</button>
          <button
          className="primary-contained-btn"
          onClick={()=>{
            setView("instructions");
            setSelectedQuestionIndex(0);
            setSelectedOptions({});
            setSecondsLeft(examData.duration)
          }}>Retake Exam</button>
      
         </div> */}
            {/* //end retake exam */}
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
