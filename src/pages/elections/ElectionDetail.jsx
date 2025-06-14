import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  ListGroup,
  Tab,
  Nav,
  Modal,
  Table,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaUserTie,
  FaVoteYea,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import {
  getElectionById,
  deleteElection,
  addCandidateToElection,
  addUsersToElection,
  deleteUsersToElection,
} from "../../services/electionService";
import {
  getCandidateByElectionId,
  getCandidateNotInELection,
} from "../../services/CandidateService";
import { getVotesByElectionId } from "../../services/VoteService";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import CandidateCard from "../../components/candidates/CandidateCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import {
  getUserByElectionId,
  getUserNotInELection,
} from "../../services/userService";
import CountdownTimer from "../../components/elections/CountdownTimer";
import ActivationNotice from "../../components/untils/ActivationNotice";
const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, currentUser } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [candidatesNotInELection, setCandidatesNotInElection] = useState([]);
  const [usersNotInELection, setUsersNotInElection] = useState([]);
  const [votes, setVotes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermUserElection, setSearchTermUserElection] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredUsersElection, setFilteredUsersElection] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [canVote, setCanVote] = useState(false);
  useEffect(() => {
    // Load election data
    const electionData = async () => {
      const data = await getElectionById(id);
      setElection(data);
    };

    const electionVotes = async () => {
      const data = await getVotesByElectionId(id);
      setVotes(data);
    };

    electionData();
    electionVotes();
  }, [id, navigate, currentUser]);

  const candidateData = async () => {
    if (election) {
      const data = await getCandidateByElectionId(election.id);
      setCandidates(data);
    }
  };
  useEffect(() => {
    candidateData();
  }, [election]);

  const userData = async () => {
    if (election) {
      const data = await getUserByElectionId(election.id);
      setUsers(data);
    }
  };
  useEffect(() => {
    userData();
  }, [election]);
  useEffect(() => {
    if (userData && currentUser) {
      const isParticipant = users.find((user) => user.id === currentUser.id);
      setCanVote(isParticipant);
    }
  }, [userData, currentUser]);
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteElection = async () => {
    await deleteElection(election.id);
    navigate("/elections", {
      state: { message: "Cuộc bỏ phiếu đã được xóa thành công!" },
    });
  };
  // Modal thêm candidate
  const handleShow = async () => {
    try {
      const data = await getCandidateNotInELection(id);
      setCandidatesNotInElection(data);
      setShowCandidates(true);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ứng viên:", error);
    }
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates((prevSelected) => {
      if (prevSelected.includes(candidateId)) {
        return prevSelected.filter((id) => id !== candidateId);
      } else {
        return [...prevSelected, candidateId];
      }
    });
  };

  const handleSelect = async () => {
    try {
      await addCandidateToElection(id, selectedCandidates);
      toast.success("Thêm thành công các ứng viên vào cuộc bầu cử", {
        position: "top-right",
        autoClose: 5000,
      });
      setActiveTab("candidates");
      candidateData();
      setShowCandidates(false);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thêm ứng viên vào cuộc bầu cử", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };
  const handleCloseCandidates = () => setShowCandidates(false);

  // Add User
  const handleShowUser = async () => {
    try {
      const data = await getUserNotInELection(id);
      setUsersNotInElection(data);
      setShowUsers(true);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ứng viên:", error);
    }
  };
  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleAddUsersSelected = async () => {
    try {
      await addUsersToElection(id, selectedUsers);
      toast.success(
        "Thêm thành công danh sách người bỏ phiếu vào cuộc bầu cử",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      setActiveTab("users");
      userData();
      setSelectedUsers([]);
      setShowUsers(false);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thêm người bỏ phiếu vào cuộc bầu cử", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };
  const handleDeleteUsers = async () => {
    try {
      await deleteUsersToElection(id, selectedUsers);
      toast.success("Xóa thành công danh sách người bỏ phiếu vào cuộc bầu cử", {
        position: "top-right",
        autoClose: 5000,
      });
      setActiveTab("users");
      userData();
      setSelectedUsers([]);
      setShowUsers(false);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi xóa người bỏ phiếu vào cuộc bầu cử", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };
  const handleCloseUsers = () => setShowUsers(false);
  // Search Candidate
  useEffect(() => {
    let filtered = candidatesNotInELection;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((candidate) => {
        const fullName = candidate.fullName?.toLowerCase() || "";
        const email = candidate.email?.toLowerCase() || "";
        return fullName.includes(term) || email.includes(term);
      });
    }
    setFilteredCandidates(filtered);
  }, [candidatesNotInELection, searchTerm]);

  // Search User
  useEffect(() => {
    let filtered = usersNotInELection;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        const fullName = user.fullName?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const username = user.username?.toLowerCase() || "";
        return (
          fullName.includes(term) ||
          email.includes(term) ||
          username.includes(term)
        );
      });
    }
    setFilteredUsers(filtered);
  }, [usersNotInELection, searchTerm]);

  useEffect(() => {
    let filtered = users;
    if (searchTermUserElection) {
      const term = searchTermUserElection.toLowerCase();
      filtered = filtered.filter((user) => {
        const fullName = user.fullName?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const username = user.username?.toLowerCase() || "";
        return (
          fullName.includes(term) ||
          email.includes(term) ||
          username.includes(term)
        );
      });
    }
    setFilteredUsersElection(filtered);
  }, [users, searchTermUserElection]);

  // Toast
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state?.message, {
        position: "top-right",
        autoClose: 5000,
      });
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 2000);
    }
  }, [location.pathname, navigate, location.state]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "ONGOING":
        return <Badge bg="primary">Đang diễn ra</Badge>;
      case "UPCOMING":
        return <Badge bg="warning">Sắp diễn ra</Badge>;
      case "FINISHED":
        return <Badge bg="success">Đã kết thúc</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  if (!election) {
    return <div>Loading...</div>;
  }
  const getCandidateName = (candidateId) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.fullName : "Ứng viên không xác định";
  };
  const getUserVoteName = (userId) => {
    const user = users.find((c) => c.id === userId);
    return user ? user.fullName : "Ứng viên không xác định";
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">{election.title}</h1>
        {isAdmin && (
          <div>
            <Link
              to={`/elections/${id}/edit`}
              className="btn btn-outline-primary me-2"
            >
              <FaEdit className="me-2" /> Chỉnh sửa
            </Link>
            <Button variant="outline-danger" onClick={handleShowDeleteModal}>
              <FaTrash className="me-2" /> Xóa
            </Button>
          </div>
        )}
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Card className="mb-4">
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="details">Thông tin</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="candidates">
                  <FaUserTie className="me-1" /> Ứng viên ({candidates.length})
                </Nav.Link>
              </Nav.Item>
              {isAdmin && (
                <Nav.Item>
                  <Nav.Link eventKey="users">
                    <FaUserCircle className="me-1" /> Người bỏ phiếu (
                    {users.length})
                  </Nav.Link>
                </Nav.Item>
              )}
              {isAdmin && (
                <Nav.Item>
                  <Nav.Link eventKey="votes">
                    <FaVoteYea className="me-1" /> Phiếu bầu ({votes.length})
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <Row>
                  <Col md={8}>
                    <h5>Thông tin cuộc bầu cử</h5>
                    <p>{election.description}</p>
                    <h5 className="mt-4">Thời gian bầu cử</h5>
                    <p>
                      {formatToVietnameseAMPM(election.startTime)} -{" "}
                      {formatToVietnameseAMPM(election.endTime)}
                    </p>

                    {isAdmin && (
                      <>
                        <h5>Mã tham dự</h5>
                        <p>{election.electionCode}</p>
                      </>
                    )}
                  </Col>
                  <Col md={4}>
                    <Card className="mb-3">
                      <Card.Header>Trạng thái</Card.Header>
                      <Card.Body className="text-center">
                        <h4>{getStatusBadge(election.status)}</h4>
                      </Card.Body>
                    </Card>

                    <Card className="mb-3">
                      <Card.Header>
                        Thời gian chi tiết của cuộc bỏ phiếu
                      </Card.Header>
                      <Card.Body className="text-center">
                        <CountdownTimer
                          startTime={election.startTime}
                          endTime={election.endTime}
                          status={election.status}
                        />
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Header>Thống kê</Card.Header>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Ứng viên:</span>
                          <strong>{candidates.length}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Tổng số vote:</span>
                          <strong>{votes.length}</strong>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="candidates">
                <div className="text-start py-4">
                  {isAdmin && (
                    <Button variant="outline-success" onClick={handleShow}>
                      <FaUserTie className="me-2" /> + Thêm ứng viên
                    </Button>
                  )}
                </div>
                {candidates.length > 0 ? (
                  <Row>
                    {candidates.map((candidate) => (
                      <Col md={6} lg={3} key={candidate.id} className="mb-4">
                        <CandidateCard
                          candidate={candidate}
                          election={election}
                          showVoteButton={true}
                          setActiveTab={setActiveTab}
                          candidateData={candidateData}
                          canVote={canVote}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      Chưa có ứng viên cho cuộc bầu cử này.
                    </p>
                  </div>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="users">
                <Card className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>
                            <FaSearch />
                          </InputGroup.Text>
                          <Form.Control
                            placeholder="Tìm kiếm người dùng theo tên, username hoặc email..."
                            value={searchTermUserElection}
                            onChange={(e) =>
                              setSearchTermUserElection(e.target.value)
                            }
                          />
                        </InputGroup>
                      </Col>
                      <Col md={4}>
                        <div className="text-end ">
                          {isAdmin && (
                            <Button
                              variant="outline-success"
                              onClick={handleShowUser}
                            >
                              <FaUserTie className="me-2" /> + Thêm người bỏ
                              phiếu
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                {users.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Họ tên</th>
                        <th>Tên đăng nhập</th>
                        <th>Email</th>
                        <th style={{ textAlign: "center" }}>Lựa chọn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsersElection.length > 0 ? (
                        <>
                          {filteredUsersElection.map((user, index) => (
                            <tr key={user.id}>
                              <td>{index + 1}</td>
                              <td>{user.fullName}</td>
                              <td>{user.username}</td>
                              <td>{user.email}</td>
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  value={user.id}
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleSelectUser(user.id)}
                                  style={{ width: "20px", height: "20px" }}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colSpan="5"
                              style={{
                                textAlign: "center",
                                paddingTop: "15px",
                              }}
                            >
                              <Button onClick={handleDeleteUsers}>
                                Xóa những người dùng đã chọn khỏi cuộc bỏ phiếu
                              </Button>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            <Card className="text-center p-5">
                              <Card.Body>
                                <p className="text-muted">
                                  Không tìm thấy người dùng.
                                </p>
                              </Card.Body>
                            </Card>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      Chưa có người bỏ phiếu cho cuộc bầu cử này.
                    </p>
                  </div>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="votes">
                {votes.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Người bỏ phiếu</th>
                          <th>Ứng viên</th>
                          <th>Thời gian bỏ phiếu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {votes.map((vote, index) => (
                          <tr key={vote.id}>
                            <td>{index + 1}</td>
                            <td>{getUserVoteName(vote.userId)}</td>
                            <td>{getCandidateName(vote.candidateId)}</td>
                            <td>{new Date(vote.voteTime).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      Chưa có phiếu bầu nào được ghi nhận cho cuộc bầu cử này.
                    </p>
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Election"
        message={`Bạn có chắc chắn xóa cuộc bầu cử "${election?.title}" không? Không thể hoàn tác hành động này.`}
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteElection}
        onCancel={handleCloseDeleteModal}
      />

      {/* Modal thêm candidate vào election */}
      <Modal show={showCandidates} onHide={handleCloseCandidates} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Danh sách ứng viên có thể thêm vào cuộc bỏ phiếu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm kiếm ứng viên theo tên và email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Giới thiệu</th>
                <th>Lựa chọn</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length > 0 ? (
                <>
                  {filteredCandidates.map((candidate, index) => (
                    <tr key={candidate.id}>
                      <td>{index + 1}</td>
                      <td>{candidate.fullName}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.description}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          value={candidate.id}
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleSelectCandidate(candidate.id)}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", paddingTop: "15px" }}
                    >
                      <Button onClick={handleSelect}>
                        Thêm các ứng viên đã chọn
                      </Button>
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    <Card className="text-center p-5">
                      <Card.Body>
                        <p className="text-muted">Không tìm thấy ứng viên.</p>
                      </Card.Body>
                    </Card>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Thêm User vào election */}
      <Modal show={showUsers} onHide={handleCloseUsers} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Danh sách người tham gia có thể thêm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm kiếm người dùng theo tên và email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Lựa chọn</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                <>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.fullName}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          value={user.id}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", paddingTop: "15px" }}
                    >
                      <Button onClick={handleAddUsersSelected}>
                        Thêm các người dùng đã chọn
                      </Button>
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    <Card className="text-center p-5">
                      <Card.Body>
                        <p className="text-muted">Không tìm thấy người dùng.</p>
                      </Card.Body>
                    </Card>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ElectionDetail;
