import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Badge, Modal, Form } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import {
  getCandidateById,
  deleteCandidate,
  updateImageCandidate,
} from "../../services/candidateService";
import { getElectionByCandidateId } from "../../services/electionService";
import ActivationNotice from "../../components/untils/ActivationNotice";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [elections, setElections] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const candidateData = async () => {
      const data = await getCandidateById(id);
      setCandidate(data);
    };

    candidateData();
  }, [id]);
  useEffect(() => {
    if (candidate) {
      const electionData = async () => {
        const data = await getElectionByCandidateId(candidate.id);
        setElections(data);
      };
      electionData();
    }
  }, [candidate]);
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteCandidate = async () => {
    await deleteCandidate(id);
    navigate("/candidates", {
      state: { message: "Ứng viên đã được xóa thành công!" },
    });
  };
  if (!candidate || !elections) {
    return <div>Loading...</div>;
  }
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
        await updateImageCandidate(id, selectedFile);
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
  if (currentUser && !currentUser.active) {
    return <ActivationNotice />;
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/candidates" className="btn btn-outline-secondary me-2">
            <FaArrowLeft className="me-1" /> Quay lại danh sách ứng viên
          </Link>
        </div>
        {isAdmin && (
          <div>
            <Link
              to={`/candidates/${id}/edit`}
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

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="text-center mb-4">
                <img
                  src={candidate.urlAvatar}
                  alt={candidate.fullName}
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px" }}
                />
              </div>
              {isAdmin && (
                <div className="text-center mb-4">
                  <Button variant="outline-success" onClick={handleShow}>
                    <FaEdit className="me-2" /> Cập nhật hình ảnh
                  </Button>
                </div>
              )}
              <div className="text-center mb-4">
                <h1 className="mb-3 mt-3">{candidate.fullName}</h1>
              </div>
            </Col>
            <Col md={8}>
              <div className="mb-4">
                <h3>Thông tin ứng viên</h3>
                <p className="mt-3">
                  Giới thiệu chung: {candidate.description}
                </p>
                <p>Email: {candidate.email}</p>
                <p>Số điện thoại: {candidate.phone}</p>
                <p>
                  Giới tính:{" "}
                  {candidate.gender == "MALE"
                    ? "Nam"
                    : candidate.gender == "FEMALE"
                    ? "Nữ"
                    : "Khác"}
                </p>
              </div>

              <div className="mb-4">
                <h5>Thông tin các cuộc bỏ phiếu tham gia</h5>
                <Card className="bg-light">
                  <Card.Body>
                    {elections.map((election) => (
                      <div
                        key={election.id}
                        className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
                      >
                        <div>
                          <Link to={`/elections/${election.id}`}>
                            <h6 className="mb-1">{election.title}</h6>
                          </Link>
                          <div>
                            <small className="text-muted">
                              {new Date(
                                election.startTime
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(election.endTime).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
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
                          {getStatusBadge(election.status)}
                        </Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showDeleteModal}
        title="Xóa ứng viên"
        message={`Bạn có chắc chắn muốn xóa ứng viên "${candidate.fullName} " không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteCandidate}
        onCancel={handleCloseDeleteModal}
      />

      {/* Upload Image */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật hình ảnh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={candidate.urlAvatar}
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
      <ToastContainer />
    </div>
  );
};

export default CandidateDetail;
