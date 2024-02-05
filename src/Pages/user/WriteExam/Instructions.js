import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView,startTimer }) {

 const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-5">
      <ul className="flex flex-col  item-center gap-1">
        <h1 className="text-2xl underline text-center ">Instructions</h1>
        <li>Exam must be completed in {examData.duration}secons.</li>
        <li>Exam must be completed in {examData.duration}secons.</li>
        <li>Once submitted you connot change your answers.</li>
        <li>Do not refresh the page</li>
        <li>
          {" "}
          you can use the <span className="font-bold">Previous</span>and{" "}
          <spam className="font-bolt">Next</spam>button to navigate between
          question
        </li>
        <li>
          Total marks of the exam is{" "}
          <spam className="font-bold">{examData.totalMarks}</spam>
        </li>
        <li>
          Passing marks of the exam is{" "}
          <spam className="font-bold">{examData.totalMarks}</spam>
        </li>
      </ul>
      <div className="flex gap-2">
      <button className="primary-contained-btn" 
      onClick={()=> navigate("/")}>Close</button>
      <button
        className="primary-contained-btn "
        onClick={() =>{
          startTimer();
          setView("questions")
        }}
      >
        Start Exam
      </button>
      </div>
    </div>
  );
}

export default Instructions;
