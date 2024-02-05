import { useState } from "react";
import { read, utils, writeFile } from "xlsx";
import React, { useEffect } from "react";
import { Select, Form, message, Row, Col, Table, Button } from "antd";
import PageTitle from "../../../Component/PageTitle";
import { Await, useNavigate, useParams } from "react-router-dom";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../Apicalls/exams";
import { useDispatch } from "react-redux";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import AddEditQuestion from "./AddEditQuestion";

import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Papa from "papaparse";
import { getAllExcel } from "../../../Apicalls/reports";

function AddEditExam() {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = React.useState(null);

  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    React.useState(false);

  const [selectedQuestion, setSelectedQuestion] = React.useState(null);

  const params = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;
      if (params.id) {
        response = await editExamById({ examId: params.id, ...values });
      } else {
        response = await addExam(values);
      }
      dispatch(HideLoading());
      if (response.success) {
        navigate("/admin/exams");
        return message.success(response.message);
      } else {
        return message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      return message.error(error.message);
    }
  };



  
  const getExamData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id, tempFilters
      });

      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };



 //export section
  
  const handleExportCSV = () => {
    if (!examData || !examData.questions) {
      message.warning("No questions available for export.");
      return;
    }

    const csvData = examData.questions.map((question) => ({
      Question: question.name,
      Options: Object.keys(question.options)
        .map((key) => `${key}: ${question.options[key]}`)
        .join(", "),
      "Correct Option": `${question.correctOption}: ${
        question.options[question.correctOption]
      }`,
    }));

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "questions_export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
//  end hare
 

  useEffect(() => {

   
     
   
  }, []);


  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id,
      });

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => {
          return (
            <div>
              {key}: {record.options[key]}
            </div>
          );
        });
      },
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text, record) => {
        return `${record.correctOption} : ${
          record.options[record.correctOption]
        }`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteQuestion(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center">
        <PageTitle title={params.id ? "Edit Exam" : "Add Exam"} />
        <div className="divider"></div>


        <Button
          className="primary-contained-btn flex items-center"
          onClick={""}
        >
          Import to CSV<i class="ri-corner-down-left-fill"></i>
        </Button>
        <Button
          className="primary-contained-btn flex items-center"
          onClick={handleExportCSV}
        >
          Export to CSV<i class="ri-arrow-down-fill"></i>
        </Button>
      </div>

      <Form layout="vertical" onFinish={onFinish} initialvalues={examData}>
        <Tabs defaultActivekey="1">
          <TabPane tab="Exam Details" key="1">
            <Row gutter={[30, 20]}>
              <Col span={8}>
                <Form.Item label="Exam Name" name="name">
                  <input type="text" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Exam Duration" name="duration">
                  <input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Category" name="category">
                  <Select>
                    <Select.Option value="javascript">JavaScript</Select.Option>
                    <Select.Option value="reactjs">React_js</Select.Option>
                    <Select.Option value="mongodb">Mongo_DB</Select.Option>
                    <Select.Option value="nodejs">Node_js</Select.Option>
                    <Select.Option value="python">Python</Select.Option>
                    <Select.Option value="HTML">HTML</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Total Marks" name="totalMarks">
                  <input type="number" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Passing Marks:" name="passingMarks">
                  <input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <div className="flex justify-end gap-3">
              <button
                className="primary-outlined-btn"
                type="button"
                onClick={() => navigate("/admin/exams")}
              >
                Cancel
              </button>
              <button className="primary-contained-btn" type="submit">
                Save
              </button>
            </div>
          </TabPane>
          {params.id && (
            <TabPane tab=" Question" key="2">
              <div className="flex justify-end gap-4">
                <button
                  className="primary-contained-btn"
                  type="button"
                  onClick={() => setShowAddEditQuestionModal(true)}
                >
                  Add Question<i class="ri-corner-down-left-fill"></i>
                </button>
              </div>
            
              <Table
                columns={questionsColumns}
                dataSource={examData?.questions || []}
              />
            </TabPane>
          )}
        </Tabs>
       
      </Form>

      {/* //add question */}

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
    </div>
  );
}

export default AddEditExam;
