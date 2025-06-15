import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getUserById,
  createUser,
  updateUser,
} from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Tên đăng nhập không được để trống")
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ được chứa chữ không dấu, số và dấu gạch dưới"
    ),

  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: Yup.string().required("Tên không được đẻ trống"),
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Email không được để trống"),
  dateOfBirth: Yup.date().required("Ngày sinh không được bỏ trống"),
  phone: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  address: Yup.string().required("Địa chỉ không được bỏ trống"),
  role: Yup.string().required("Hãy chọn role"),
  gender: Yup.string().required("Hãy chọn giới tính"),
});

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    role: "USER",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        if (id && isEditMode) {
          const data = await getUserById(id);
          setUser(data);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateUser(id, values);
        navigate("/users", {
          state: {
            message: "Người dùng đã được cập nhật thông tin thành công!",
          },
        });
      } else {
        await createUser(values);
        navigate("/users", {
          state: { message: "Thêm người dùng thành công!" },
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm", error);
      const message =
        error.response?.data?.message || "Có lỗi khi thao tác với dữ liệu!";
      toast.error(message, {
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
        {isEditMode ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
      </h1>

      <Card>
        <Card.Body>
          <Formik
            initialValues={user}
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
                    <Form.Group controlId="username">
                      <Form.Label>Tên đăng nhập</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.username && errors.username}
                        disabled={isEditMode}
                      />
                      {isEditMode && (
                        <Form.Text className="text-muted">
                          Tên đăng nhập không thể thay đổi
                        </Form.Text>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="password">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="fullName">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="fullName"
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
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                        disabled={isEditMode}
                      />
                      {isEditMode && (
                        <Form.Text className="text-muted">
                          Email không thể thay đổi
                        </Form.Text>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
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
                    <Form.Group controlId="role">
                      <Form.Label>Vai trò</Form.Label>
                      <Form.Select
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.role && errors.role}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.role}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  {isEditMode && (
                    <Col md={6}>
                      <Form.Group controlId="active">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Select
                          name="active"
                          value={values.active}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="true">Xác thực</option>
                          <option value="false">Chưa xác thực</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  )}
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

                {!isEditMode && (
                  <div className="alert alert-info">
                    <p className="mb-0">
                      <strong>Lưu ý:</strong> Vui lòng cung cấp đầy đủ thông tin
                      người dùng
                    </p>
                  </div>
                )}

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/users")}
                  >
                    Hủy bỏ
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Đang lưu..."
                      : isEditMode
                      ? "Cập nhật"
                      : "Tạo mới"}
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

export default UserForm;
