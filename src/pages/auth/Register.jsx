import { useState } from "react";
import { Form, Button, Card, Alert, Container, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaVoteYea } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/login.css";
import { verifyUser } from "../../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [registeredUser, setRegisteredUser] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 6) {
      return setError("Tên đăng nhập phải có ít nhất 6 ký tự");
    }
    if (password !== confirmPassword) {
      return setError("Mật khẩu nhập lại không khớp");
    }
    if (password.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự");
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      return setError(
        "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số"
      );
    }

    try {
      setError("");
      setLoading(true);
      const user = {
        username,
        password,
        email,
        fullName,
      };
      const registered = await register(user);
      setRegisteredUser(registered);
      setShowVerifyModal(true);
    } catch (error) {
      setError("Tên đăng nhập hoặc email đã tồn tại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    const verifyRequest = {
      username: registeredUser.username,
      verifyCode: verificationCode,
    };
    try {
      setVerifying(true);
      await verifyUser(verifyRequest);
      setShowVerifyModal(false);
      navigate("/login", {
        state: {
          message:
            "Xác thực thông tin thành công, hãy đăng nhập bằng tài khoản vừa tạo",
        },
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Card className="auth-card mx-auto">
          <Card.Body>
            <div className="auth-logo">
              <FaVoteYea size={50} className="text-primary" />
              <h2 className="text-center mt-2">Tạo tài khoản</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập "
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tạo mật khẩu của bạn"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </div>
          </Card.Body>
        </Card>

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
              Mã xác nhận đã được gửi đến{" "}
              <strong>{registeredUser?.email}</strong>.
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
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Register;
