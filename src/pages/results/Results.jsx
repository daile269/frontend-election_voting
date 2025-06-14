import { useState, useEffect } from "react";
import { Card, Table, Badge, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";
import { getElections } from "../../services/electionService";

import ActivationNotice from "../../components/untils/ActivationNotice";
import { useAuth } from "../../context/AuthContext";
import { getResults } from "../../services/resultService";
const Results = () => {
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { currentUser, isAdmin } = useAuth();
  useEffect(() => {
    const fetchElections = async () => {
      const data = await getElections();
      setElections(data);
    };
    const fetchResults = async () => {
      const data = await getResults();
      setResults(data);
    };
    fetchElections();
    fetchResults();
  }, []);

  // Filter elections based on status if selected
  const filteredElections = selectedStatus
    ? elections.filter((election) => election.status === selectedStatus)
    : elections;

  const getResultForElection = (electionId) => {
    return results.find((result) => result.electionId === electionId);
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "UPCOMING":
        return "Sắp diễn ra";
      case "ONGOING":
        return "Đang diễn ra";
      case "FINISHED":
        return "Đã kết thúc";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };
  // Format Date
  const formatToVietnameseAMPM = (rawDateStr) => {
    const isoStr = rawDateStr.replace(" ", "T").slice(0, 23);
    const date = new Date(isoStr);

    const parts = new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type)?.value;

    const day = get("day");
    const month = get("month");
    const year = get("year");
    const hour = get("hour");
    const minute = get("minute");
    const dayPeriod = get("dayPeriod");

    return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`;
  };
  if (currentUser && !currentUser.active) {
    return <ActivationNotice />;
  }
  return (
    <div>
      <h1 className="page-title">Kết quả bỏ phiếu</h1>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Lọc theo trạng thái của cuộc bỏ phiếu</Form.Label>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Tất cả cuộc bỏ phiếu</option>
                  <option value="ONGOING">Đang diễn ra</option>
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="FINISHED">Đã kết thúc</option>
                  <option value="CANCELLED">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Table hover responsive>
            <thead>
              <tr>
                <th>Cuộc bỏ phiếu</th>
                <th>Trạng thái</th>
                <th>Thời gian diễn ra</th>
                <th>Tổng số phiếu bầu</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {filteredElections.map((election) => {
                const result = getResultForElection(election.id);

                return (
                  <tr key={election.id}>
                    <td>{election.title}</td>
                    <td>
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
                        {getStatusLabel(election.status)}
                      </Badge>
                    </td>
                    <td>
                      {formatToVietnameseAMPM(election.startTime)} -{" "}
                      {formatToVietnameseAMPM(election.endTime)}
                    </td>
                    <td>{result ? result.totalVotes : 0}</td>
                    <td>
                      {result && (isAdmin || election.status === "FINISHED") ? (
                        <Link
                          to={`/results/${election.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <FaChartBar className="me-1" /> Xem kết quả
                        </Link>
                      ) : (
                        <Button variant="outline-secondary" size="sm" disabled>
                          <FaChartBar className="me-1" /> Chưa có kết quả
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredElections.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">
                Không tìm thấy cuộc bầu cử nào. Hãy thử tìm kiếm khác.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Results;
