import React from "react";
import { Form, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { addQuestionToExam, editQuestionById } from "../../../Apicalls/exams";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion,
}) {
  const dispatch = useDispatch();


  console.log(selectedQuestion)
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };
      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  return (
    <Modal
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      visible={showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        setShowAddEditQuestionModal(false);
        setSelectedQuestion(null);
      }}
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: selectedQuestion?.name,
          A: selectedQuestion?.options?.A,
          B: selectedQuestion?.options?.B,
          C: selectedQuestion?.options?.C,
          D: selectedQuestion?.options?.D,
          correctOption: selectedQuestion?.correctOption,
        }}
      >
        <Form.Item name="name" label="Question">
          <input type="text" />
        </Form.Item>
        <Form.Item name="correctOption" label="correct option">
          <input type="text" />
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item name="A" label="option A">
            <input type="text" />
          </Form.Item>
          <Form.Item name="B" label="option B">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="flex gap-2">
          <Form.Item name="C" label="option C">
            <input type="text" />
          </Form.Item>
          <Form.Item name="D" label="option D">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="flex justify-end mt-2 gap-3">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => setShowAddEditQuestionModal(false)}
          >
            cancel
          </button>
          <button className="primary-contained-btn">Save</button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditQuestion;
