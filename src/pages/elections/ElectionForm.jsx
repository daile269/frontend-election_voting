import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getElectionById,
  createElection,
  updateElection,
} from "../../services/electionService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Chủ đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  startTime: Yup.date().required("Ngày bắt đầu không được bỏ trống"),
  endTime: Yup.date()
    .required("Ngày kết thúc không được bỏ trống")
    .min(Yup.ref("startTime"), "Ngày kết thúc phải sau ngày bắt đầu"),
});

const ElectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const electionData = async () => {
        const data = await getElectionById(id);
        setElection(data);
      };
      electionData();
      if (electionData) {
        setElection({
          ...electionData,
          startTime: electionData.startTime,
          endTime: electionData.endTime,
        });
      } else {
        navigate("/elections");
      }
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateElection(id, values);
        navigate("/elections", {
          state: { message: "Cuộc bỏ phiếu đã được cập nhật thành công!" },
        });
      } else {
        await createElection(values);
        navigate("/elections", {
          state: { message: "Cuộc bỏ phiếu đã được thêm thành công!" },
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      toast.error("Có lỗi khi thao tác với dữ liệu!", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">
        {isEditMode
          ? "Chỉnh sửa thông tin cuộc bỏ phiếu"
          : "Thêm mới cuộc bỏ phiếu"}
      </h1>

      <Card>
        <Card.Body>
          <Formik
            initialValues={election}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="title">
                      <Form.Label>Chủ đề</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.title && errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="description">
                      <Form.Label>Mô tả khái quát</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.description && errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="startTime">
                      <Form.Label>Ngày bắt đầu</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="startTime"
                        value={
                          values.startTime
                            ? values.startTime.replace(" ", "T").slice(0, 19)
                            : ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.startTime && errors.startTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="endTime">
                      <Form.Label>Ngày kết thúc</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="endTime"
                        value={
                          values.endTime
                            ? values.endTime.replace(" ", "T").slice(0, 19)
                            : ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.endTime && errors.endTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/elections")}
                  >
                    Hủy bỏ
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Lưu..."
                      : isEditMode
                      ? "Cập nhật"
                      : "Thêm mới"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default ElectionForm;
