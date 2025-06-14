import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import {
  FaFilePdf,
  FaFileExcel,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { getElectionById } from "../../services/electionService";
import { getCandidateByElectionId } from "../../services/CandidateService";
import ActivationNotice from "../../components/untils/ActivationNotice";
import { useAuth } from "../../context/AuthContext";
import { Bar } from "react-chartjs-2";
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
import { getResultForElection } from "../../services/resultService";

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

const ResultDetail = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [result, setResult] = useState(null);
  const { currentUser } = useAuth();
  useEffect(() => {
    const electionData = async () => {
      const data = await getElectionById(id);
      setElection(data);
    };
    const candidatesElection = async () => {
      const data = await getCandidateByElectionId(id);
      setCandidates(data);
    };
    const electionResults = async () => {
      const data = await getResultForElection(id);
      setResult(data);
    };
    electionData();
    candidatesElection();
    electionResults();
  }, [id]);
  if (!election || !result) {
    return <div>Loading...</div>;
  }

  // Biểu đồ

  const barChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
      legend: {
        position: "bottom",
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: function (value) {
          return value + "%";
        },
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        title: {
          display: true,
          text: "Tỷ lệ (%)",
        },
      },
    },
  };

  const barChartData = {
    labels: candidates.map((candidate) => candidate.fullName),
    datasets: [
      {
        label: "Đồng ý",
        data: result.tallies.map((tally) =>
          ((tally.agree / tally.votes) * 100).toFixed(1)
        ),
        backgroundColor: "#198754",
        borderRadius: 4,
      },
      {
        label: "Không đồng ý",
        data: result.tallies.map((tally) =>
          ((tally.disagree / tally.votes) * 100).toFixed(1)
        ),
        backgroundColor: "#dc3545",
        borderRadius: 4,
      },
    ],
  };

  if (currentUser && !currentUser.active) {
    return <ActivationNotice />;
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/results" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" />
            Quay về trang danh sách kết quả
          </Link>
        </div>
        <div>
          <Button variant="outline-success" className="me-2">
            <FaFileExcel className="me-2" /> Xuất kết quả thành file Exel
          </Button>
          <Button variant="outline-danger">
            <FaFilePdf className="me-2" /> Xuất kết quả thành file PDF
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <h2 className="mb-4">Kết quả của cuộc bỏ phiếu : {election.title}</h2>

          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h2>{result.totalVotes}</h2>
                  <p className="text-muted mb-0">Tổng số phiếu bầu</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h2>{candidates.length}</h2>
                  <p className="text-muted mb-0">Tổng số ứng viên</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <p className="text-muted mb-0">Trạng thái kết quả</p>
                </Card.Body>
                <p>
                  <Badge
                    bg={election.status === "FINISHED" ? "success" : "info"}
                  >
                    {election.status === "FINISHED"
                      ? "Kết quả cuối cùng"
                      : "Chưa có kết quả chính thức"}
                  </Badge>
                </p>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={12}>
              <Card>
                <Card.Header>Biểu đồ thống kê</Card.Header>
                <Card.Body>
                  <div style={{ height: "600px" }}>
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>Kết quả chi tiết</Card.Header>
            <Card.Body>
              <Row>
                {result.tallies.map((tally, index) => {
                  const candidate = candidates.find(
                    (c) => c.id === tally.candidateId
                  );
                  const agreePercentage = (
                    (tally.agree / tally.votes) *
                    100
                  ).toFixed(2);
                  const disagreePercentage = (
                    (tally.disagree / tally.votes) *
                    100
                  ).toFixed(2);

                  return (
                    <Col md={6} key={index} className="mb-4">
                      <Card className="h-100">
                        <Card.Body>
                          <div className="d-flex align-items-center mb-4">
                            <img
                              src={candidate?.urlAvatar}
                              alt={candidate?.fullName}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                              className="me-3"
                            />
                            <div>
                              <h5 className="mb-1">{candidate?.fullName}</h5>
                              <div className="text-muted">
                                {candidate?.description}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="d-flex align-items-center">
                                <FaCheckCircle className="text-success me-2" />
                                <span>Đồng ý</span>
                              </div>
                              <div>
                                <strong>{tally.agree}</strong>
                                <span className="text-muted ms-2">
                                  ({agreePercentage}%)
                                </span>
                              </div>
                            </div>
                            <div
                              className="progress"
                              style={{ height: "10px" }}
                            >
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${agreePercentage}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="d-flex align-items-center">
                                <FaTimesCircle className="text-danger me-2" />
                                <span>Không đồng ý</span>
                              </div>
                              <div>
                                <strong>{tally.disagree}</strong>
                                <span className="text-muted ms-2">
                                  ({disagreePercentage}%)
                                </span>
                              </div>
                            </div>
                            <div
                              className="progress"
                              style={{ height: "10px" }}
                            >
                              <div
                                className="progress-bar bg-danger"
                                style={{ width: `${disagreePercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-3 text-center">
                            <small className="text-muted">
                              Tổng số người đã bỏ phiếu: {tally.votes}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResultDetail;
