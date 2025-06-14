import { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { getElections } from "../../services/electionService";
import ActivationNotice from "../../components/untils/ActivationNotice";
import { useAuth } from "../../context/AuthContext";
const ElectionSearch = () => {
  const [electionCode, setElectionCode] = useState("");
  const [error, setError] = useState("");
  const [elections, setElections] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Tìm kiếm bởi electionCode
  useEffect(() => {
    const fetchElections = async () => {
      const data = await getElections();
      setElections(data);
    };
    fetchElections();
  }, [location.search]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!electionCode.trim()) {
      setError("Vui lòng nhập mã tham dự của cuộc bỏ phiếu");
      return;
    }
    const election = elections.find((e) => e.electionCode === electionCode);

    if (election) {
      navigate(`/elections/${election.id}`, {
        state: {
          message:
            "Tham dự cuộc bỏ phiếu thành công! Bạn có thể xem thông tin cuộc bỏ phiếu và chọn ra ứng viên phù hợp",
        },
      });
    } else {
      setError("Không tìm thấy cuộc bỏ phiếu nào với mã này");
    }
  };
  if (currentUser && !currentUser.active) {
    return <ActivationNotice />;
  }
  return (
    <div>
      <h1 className="page-title">Tham gia cuộc bỏ phiếu</h1>

      <Card className="mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <FaSearch className="me-2" />
            Nhập mã tham dự của cuộc bỏ phiếu
          </Card.Title>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="electionCode">
              <Form.Control
                type="text"
                placeholder="Nhập mã tham gia"
                value={electionCode}
                onChange={(e) => setElectionCode(e.target.value)}
                className="form-control-lg text-center"
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" size="lg" type="submit">
                <FaSearch className="me-2" />
                Tham gia cuộc bỏ phiếu
              </Button>
            </div>
          </Form>

          <div className="mt-4 text-center text-muted">
            <small>
              Nhập mã tham dự để tìm và truy cập vào một cuộc bỏ phiếu cụ thể.
              Mã có thể được tìm thấy trong lời mời bầu cử hoặc bạn có thể liên
              hệ với người tổ chức cuộc bầu cử để lấy mã tham dự.
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ElectionSearch;
