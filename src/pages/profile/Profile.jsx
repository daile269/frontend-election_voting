import { useState } from "react";
import { Card, Form, Button, Alert, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaUserCircle,
  FaBirthdayCake,
  FaLock,
  FaEdit,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyUser } from "../../services/authService";
import {
  sendVerifyCode,
  updateAvatarUser,
  updateUser,
} from "../../services/userService";

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    address: currentUser.address || "",
    username: currentUser.username || "",
    dateOfBirth: currentUser.dateOfBirth || "",
    gender: currentUser.gender || "",
  });
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.phone) {
      const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
      if (!phoneRegex.test(formData.phone)) {
        return setError(
          "Số điện thoại không hợp lệ. Phải bắt đầu bằng +84 hoặc 0 và có 10–11 chữ số."
        );
      }
    }
    try {
      setLoading(true);

      const dataToUpdate = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        username: formData.username,
        dateOfBirth: formData.dateOfBirth,
        password: currentUser.password,
        gender: formData.gender,
      };
      await updateUser(currentUser.id, dataToUpdate);
      toast.success("Cập nhật thông tin thành công", {
        position: "top-right",
        autoClose: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setError("Cập nhật hồ sơ thất bại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Xác thực
  const handleSendVerifyCode = async () => {
    try {
      setSendingCode(true);
      const data = await sendVerifyCode(currentUser.username);
      if (parseInt(data.code) === 200) {
        setShowVerifyModal(true);
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    const verifyRequest = {
      username: currentUser.username,
      verifyCode: verificationCode,
    };
    try {
      setVerifying(true);
      await verifyUser(verifyRequest);
      setShowVerifyModal(false);
      toast.success("Tài khoản của bạn đã được xác thực", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setVerifying(false);
    }
  };
  // Update Avatar
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (selectedFile) {
      try {
        await updateAvatarUser(currentUser.id, selectedFile);
        handleClose();
        toast.success("Cập nhật hình ảnh thành công!", {
          position: "top-right",
          autoClose: 5000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch {
        toast.error("Cập nhật hình ảnh thất bại!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };
  return (
    <div>
      <h1 className="page-title">Cài đặt hồ sơ</h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <h5 className="mb-4">Thông tin cá nhân</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="fullName">
                      <Form.Label>
                        <FaUser className="me-2" /> Họ và tên
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>
                        <FaEnvelope className="me-2" /> Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email không thể thay đổi
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-5">
                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label>
                        <FaPhone className="me-2" /> Số điện thoại
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="address">
                      <Form.Label>
                        <FaMapMarkerAlt className="me-2" /> Địa chỉ
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>
                        <FaUserCircle className="me-2" /> Tên đăng nhập
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="dateOfBirth">
                      <Form.Label>
                        <FaBirthdayCake className="me-2" /> Ngày sinh
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={
                          formData.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                                .toISOString()
                                .slice(0, 10)
                            : ""
                        }
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="address">
                      <Form.Label>Giới tính</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />
                <Link to="/change-password" className="btn btn-outline-primary">
                  <FaLock className="me-2" /> Thay đổi mật khẩu
                </Link>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <h5 className="mb-3">Thông tin tài khoản</h5>
                  <div className="mb-3">
                    <strong>Loại tài khoản:</strong>
                    <div className="mt-1">
                      <FaShieldAlt className="me-2 text-primary" />
                      {currentUser.role === "ADMIN"
                        ? "Quản trị viên"
                        : "Người bỏ phiếu"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Là thành viên từ:</strong>
                    <div className="mt-1 text-muted">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-center mb-4">
                    <img
                      src={currentUser.urlAvatar}
                      alt={currentUser.username}
                      className="img-fluid rounded"
                      style={{ maxHeight: "100px" }}
                    />
                  </div>
                  <div className="text-center mb-4">
                    <Button variant="outline-success" onClick={handleShow}>
                      <FaEdit className="me-2" /> Cập nhật ảnh
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Trạng thái tài khoản</h5>
              <FaShieldAlt className="me-2 text-primary" />
              <Button
                variant={currentUser.active ? "success" : "secondary"}
                className="mt-1"
                disabled
              >
                {currentUser.active ? "Đã xác thực" : "Chưa xác thực"}
              </Button>

              <p className="text-muted mt-3 px-4">
                Xác thực tài khoản để tham gia bỏ phiếu
                {!currentUser.active && (
                  <Button
                    className="ms-2"
                    variant="primary"
                    onClick={handleSendVerifyCode}
                  >
                    {sendingCode ? "Đang gửi mã ..." : "Xác thực"}
                  </Button>
                )}
              </p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Bảo mật tài khoản</h5>
              <p className="text-muted mb-0">
                Giữ tài khoản của bạn an toàn bằng cách:
              </p>
              <ul className="text-muted mt-2">
                <li>Sử dụng mật khẩu mạnh</li>
                <li>Không chia sẻ thông tin đăng nhập</li>
                <li>Đăng xuất trên các thiết bị không sử dụng</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer />

      {/* Xác thực */}
      <Modal
        show={showVerifyModal}
        onHide={() => setShowVerifyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác thực tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Mã xác nhận đã được gửi đến <strong>{currentUser?.email}</strong>.
          </p>
          <Form>
            <Form.Group controlId="verificationCode">
              <Form.Label>Nhập mã xác nhận</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã được gửi qua email"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-3"
              onClick={handleVerifyCode}
              disabled={verifying}
            >
              {verifying ? "Đang xác minh..." : "Xác nhận"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Upload Image */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={currentUser.urlAvatar}
            alt="Ảnh hiện tại"
            className="img-fluid mb-3"
          />
          <Form.Group>
            <Form.Label>Chọn ảnh mới</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
