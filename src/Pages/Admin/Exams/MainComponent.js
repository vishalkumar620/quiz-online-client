// MainComponent.js

import React from "react";
import DataTable from "./DataTable"; // Adjust the path based on your project structure

const MainComponent = () => {
  // Sample data
  const sampleData = [
    {
      name: "Question 1",
      options: { A: "Option A", B: "Option B", C: "Option C" },
      correctOption: "B",
    },
    {
      name: "Question 2",
      options: { A: "Option X", B: "Option Y", C: "Option Z" },
      correctOption: "C",
    },
    // Add more questions as needed
  ];

  return (
    <div>
      <h2>Question Table</h2>
      <DataTable data={sampleData} />
    </div>
  );
};

export default MainComponent;
