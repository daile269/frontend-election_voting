import { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword.length < 6) {
        return setError("Mật khẩu phải có ít nhất 6 ký tự");
      }
      if (newPassword !== confirmPassword) {
        return setError("Mật khẩu nhập lại không khớp");
      }

      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!strongPasswordRegex.test(newPassword)) {
        return setError(
          "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số"
        );
      }
      if (!currentPassword) {
        return setError("Hãy nhập mật khẩu cũ");
      }
    }
    try {
      setError("");
      setSuccess("");
      setLoading(true);
      const ChangePasswordData = {
        username: currentUser.username,
        oldPassword: currentPassword,
        newPassword: newPassword,
      };
      const data = await changePassword(ChangePasswordData);
      if (parseInt(data.code) === 200) {
        toast.success("Mật khẩu đã được thay đổi thành công", {
          position: "top-right",
          autoClose: 5000,
        });
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Cập nhật mật khẩu thất bại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Card className="auth-card mx-auto">
          <Card.Body>
            <div className="auth-logo">
              <FaLock size={50} className="text-primary" />
              <h2 className="text-center mt-2">Thay đổi mật khẩu</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="currentPassword">
                <Form.Label>Mật khẩu hiện tại</Form.Label>
                <Form.Control
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Đang cập nhập..." : "Thay đổi mật khẩu"}
              </Button>

              <Button
                variant="link"
                className="w-100 mt-2"
                onClick={() => navigate("/profile")}
              >
                Quay về trang quản lý thông tin cá nhân
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
