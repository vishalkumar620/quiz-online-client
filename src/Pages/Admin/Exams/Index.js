import React from "react";

// import React, { useState } from "react";
// import { read, utils, writeFile } from "axios";

import { Table, message } from "antd";
import PageTitle from "../../../Component/PageTitle";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../Apicalls/exams";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {


  // import section start

  // const [users, setUsers] = useState([]);

  // const handleImport = ($event) => {
  //   const files = $event.target.files;
  //   if (files.length) {
  //     const file = files[0];
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const wb = read(event.target.result);
  //       const sheets = wb.SheetNames;

  //       if (sheets.length) {
  //         const rows = utils.sheet_to_json(wb.sheets[sheets[0]]);
  //         setUsers(rows);
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };

  // const handleExport = () => {
  //   const headings = [["Name", "Email", "Age", "Address"]];
  //   const wb = utils.book_new();
  //   const ws = utils.json_to_sheet([]);
  //   utils.sheet_add_aoa(ws, headings);
  //   utils.sheet_add_json(ws, users, { origin: "A2", skipHeader: true });
  //   utils.book_append_sheet(wb, ws, "Report");
  //   writeFile(wb, "Report.xisx");
  // };

  // import  end this section
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();
  // const handlenavigatetoedit = () =>{
  //   navigate(`/admin/exams/edit/${record._id}`)
  // }

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getExamsData();
  }, []);
  return (
    <div>
      {/* import fiel  start*/}

      {/* <div className="row mb-2 mt-5">
        <div className="col-sm-12">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <div className="custom-file">
                  <input
                    type="file"
                    name="file"
                    className="custom-file-input"
                    id="inputGroupFile"
                    required
                    onChange={handleImport}
                    accept="file ka path dena h"
                  />
                  <label className="custom-file-label" htmlFor="inputGroupFile">
                    Choose File
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <button
                onClick={handleExport}
                className="btn btn-secondary float-right"
              >
                Export<i className="fa fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Age</th>
                <th scope="col">Address</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <th>{user.name}</th>
                    <th>{user.email}</th>
                    <th>{user.address}</th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No user Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* end */}

      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />
        <button
          className="primary-outlined-btn flex items-center"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line"></i>
          Add Exam
        </button>
      </div>
      <div className="divider"></div>

      <Table columns={columns} dataSource={exams} />
    </div>
  );
}

export default Exams;
