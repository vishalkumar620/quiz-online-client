import { Col, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../Apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../Component/PageTitle";
import { useNavigate } from "react-router-dom";




function Index() {
  const [exams, setExams] = useState([]);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users); 

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams(); // Call the getExams function to fetch data
  }, []); // Empty dependency array means it will run only once, similar to componentDidMount

  return (
    user && <div>
      <PageTitle title={`Hi ${user?.name || "Guest"}, welcome to sheyQuiz`} />
      <div className="divider"></div>
      <Row gutter={[16, 16]}>
        {exams.map((exam) => (
          <Col span={6} key={exam.id}>
            <div className="card flex flex-col gap-1 p-2 card-md">
              <h1 className="text-2xl">{exam?.name}</h1>
              <hr />
              <h1 className="text-md">Category: {exam.category}</h1>
              <h1 className="text-md">Total Marks: {exam.totalMarks}</h1>
              <h1 className="text-md">Passing Marks: {exam.passingMarks}</h1>
              <h1 className="text-md">Duration: {exam.duration}</h1>
              <button className="primary-contained-btn"
              onClick={()=>navigate(`/user/write-exam/${exam._id}`)}
              >Start Exam</button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Index;
