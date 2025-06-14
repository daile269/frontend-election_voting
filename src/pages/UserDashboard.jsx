import { Card, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaVoteYea } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getElections } from "../services/electionService";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  useEffect(() => {
    const fetchElections = async () => {
      const data = await getElections();
      setElections(data);
    };

    fetchElections();
  }, []);

  // Calculate statistics
  const activeElections = elections.filter(
    (e) => e.status === "ONGOING"
  ).length;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  // Election status data for pie chart
  const electionStatusData = {
    labels: ["Đang diễn ra", "Sắp diễn ra", "Đã hoàn thành", "Đã hủy"],
    datasets: [
      {
        data: [
          elections.filter((e) => e.status === "ONGOING").length,
          elections.filter((e) => e.status === "UPCOMING").length,
          elections.filter((e) => e.status === "FINISHED").length,
          elections.filter((e) => e.status === "CANCELLED").length,
        ],
        backgroundColor: ["#0d6efd", "#ffc107", "#198754", "#ff0000"],
        borderWidth: 1,
      },
    ],
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
  return (
    <div>
      <h1 className="page-title">Tổng quan</h1>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card primary h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <FaVoteYea size={40} className="text-primary" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Cuộc bỏ phiếu đang diễn ra</h6>
                <h3>{activeElections}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row className="mb-4">
        <Col lg={7}>
          <Card className="h-100">
            <Card.Header>Các cuộc bỏ phiếu gần đây</Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Chủ đề</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.slice(0, 5).map((election) => (
                    <tr key={election.id}>
                      <td>
                        <Link to={`/elections/${election.id}`}>
                          {election.title}
                        </Link>
                      </td>
                      <td>
                        {new Date(election.startTime).toLocaleDateString()}
                      </td>
                      <td>{new Date(election.endTime).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            election.status === "ONGOING"
                              ? "primary"
                              : election.status === "UPCOMING"
                              ? "warning"
                              : election.status === "FINISHED"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {getStatusLabel(election.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="h-100">
            <Card.Header>Tình trạng bỏ phiếu</Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ width: "100%", maxWidth: "300px" }}>
                <Pie data={electionStatusData} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
