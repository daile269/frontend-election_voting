import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getCandidateById,
  createCandidate,
  updateCandidate,
} from "../../services/candidateService";

import { getElectionByCandidateId } from "../../services/electionService";
import { ToastContainer, toast } from "react-toastify";
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Tên ứng viên không được để trống"),
  description: Yup.string().required("Giới thiệu không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  dateOfBirth: Yup.date().required("Ngày sinh bắt đầu không được bỏ trống"),
  phone: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  address: Yup.string().required("Địa chỉ không được bỏ trống"),
  gender: Yup.string().required("Vui lòng chọn giới tính"),
});

const CandidateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState({
    fullName: "",
    description: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    gender: "",
  });
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!id;
  useEffect(() => {
    if (!id) return;
    const fetchElections = async () => {
      const data = await getElectionByCandidateId(id);
      setElections(data);
    };
    fetchElections();
    const fetchCandidate = async () => {
      if (id && isEditMode) {
        const data = await getCandidateById(id);
        setCandidate(data);
      }
    };
    fetchCandidate();
  }, [id, isEditMode]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateCandidate(id, values);
        navigate("/candidates", {
          state: { message: "Ứng viên đã được cập nhật thông tin thành công!" },
        });
      } else {
        await createCandidate(values);
        navigate("/candidates", {
          state: { message: "Thêm mới ứng viên thành công!" },
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
  const getStatusBadge = (status) => {
    switch (status) {
      case "ONGOING":
        return <Badge bg="primary">Đang diễn ra</Badge>;
      case "UPCOMING":
        return <Badge bg="warning">Sắp diễn ra</Badge>;
      case "FINISHED":
        return <Badge bg="success">Đã kết thúc</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };
  return (
    <div>
      <h1 className="page-title">
        {isEditMode ? "Chỉnh sửa thông tin ứng viên" : "Thêm ứng viên mới"}
      </h1>

      <Card>
        <Card.Body>
          <Formik
            initialValues={candidate}
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
                  <Col md={6}>
                    <Form.Group controlId="fullName">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.fullName && errors.fullName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="description">
                      <Form.Label>Giới thiệu</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
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
                    <Form.Group controlId="phone">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.phone && errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="dateOfBirth">
                      <Form.Label>Ngày sinh</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={
                          values.dateOfBirth
                            ? new Date(values.dateOfBirth)
                                .toISOString()
                                .slice(0, 10)
                            : ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dateOfBirth && errors.dateOfBirth}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dateOfBirth}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="address">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address && errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="address">
                      <Form.Label>Giới tính</Form.Label>
                      <Form.Select
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.gender && errors.gender}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.gender}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={9}>
                    <h5>Thông tin các cuộc bầu cử tham gia</h5>
                    <Card className="bg-light">
                      <Card.Body>
                        {elections.map((election) => (
                          <div
                            key={election.id}
                            className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
                          >
                            <div>
                              <Link to={`/elections/${election.id}`}>
                                <h6 className="mb-1">{election.title}</h6>
                              </Link>
                              <div>
                                <small className="text-muted">
                                  {new Date(
                                    election.startTime
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    election.endTime
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                            <Badge
                              bg={
                                election.status === "ONGOING"
                                  ? "primary"
                                  : election.status === "UPCOMING"
                                  ? "warning"
                                  : election.status === "FINISHED"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {getStatusBadge(election.status)}
                            </Badge>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={3}>
                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => navigate("/candidates")}
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Lưu..."
                          : isEditMode
                          ? "Cập nhật"
                          : "Thêm mới"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default CandidateForm;
