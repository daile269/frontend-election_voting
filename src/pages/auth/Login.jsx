import { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaVoteYea } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/login.css";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const user = await login(username, password);
      if (user?.role === "ADMIN") {
        navigate("/", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (error) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Toast
  useEffect(() => {
    if (location.state?.message) {
      console.log(location.state?.message);
      toast.success(location.state.message, {
        position: "top-right",
        autoClose: 5000,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  return (
    <div className="auth-container">
      <Container>
        <Card className="auth-card mx-auto ">
          <Card.Body>
            <div className="auth-logo">
              <FaVoteYea size={50} className="text-primary" />
              <h2 className="text-center mt-2">
                Đăng nhập vào hệ thống bỏ phiếu
              </h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
              <p>
                <Link to="/forgot-password">Quên mật khẩu</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default Login;
