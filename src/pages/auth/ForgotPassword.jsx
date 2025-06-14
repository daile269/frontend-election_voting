import { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaVoteYea } from "react-icons/fa";
import { resetPassword } from "../../services/userService";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      const data = await resetPassword(email);

      if (parseInt(data.code) === 200) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else if (parseInt(data.code) === 400) {
        setError(data.message);
      }
    } catch (error) {
      setError("Thiết lập lại mật khẩu thất bại");
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
              <FaVoteYea size={50} className="text-primary" />
              <h2 className="text-center mt-2">Thiết lập lại mật khẩu</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  required
                />
                <Form.Text className="text-muted">
                  Chúng tôi sẽ gửi lại mật khẩu mới của bạn trong email đã đăng
                  ký
                </Form.Text>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Thiết lập lại mật khẩu"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>
                Bạn đã nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
              </p>
              <p>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký ở đây</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ForgotPassword;
