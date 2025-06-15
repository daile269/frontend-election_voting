import { useState, useEffect } from "react";
import { Card, Button, Table, Badge, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  getElectionsPaginated,
  deleteElection,
} from "../../services/electionService";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/untils/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActivationNotice from "../../components/untils/ActivationNotice";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  const { isAdmin, currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const size = parseInt(query.get("size"), 10) || 8;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get("page")) || 1;
    const search = query.get("search") || "";
    const status = query.get("status") || "";

    setPendingSearchTerm(search);
    setPendingStatus(status);
    setCurrentPage(page);

    const fetchElections = async () => {
      const data = await getElectionsPaginated(search, status, page, size);
      setElections(data.content);
      setTotalPages(data.totalPages);
    };

    fetchElections();
  }, [location.search]);
  // Paginated
  const handlePageChange = (newPage) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newPage);
    queryParams.set("size", size);

    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const handleShowDeleteModal = (election) => {
    setElectionToDelete(election);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setElectionToDelete(null);
  };

  const handleDeleteElection = async () => {
    if (electionToDelete) {
      await deleteElection(electionToDelete.id);
      setElections(
        elections.filter((election) => election.id !== electionToDelete.id)
      );
      toast.success("Xóa thành công cuộc bỏ phiếu", {
        position: "top-right",
        autoClose: 5000,
      });
      handleCloseDeleteModal();
    }
  };
  const handleSearch = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", 1);
    queryParams.set("size", size);

    if (pendingSearchTerm.trim() !== "") {
      queryParams.set("search", pendingSearchTerm.trim());
    } else {
      queryParams.delete("search");
    }

    if (pendingStatus) {
      queryParams.set("status", pendingStatus);
    } else {
      queryParams.delete("status");
    }

    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
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

  // Toast
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {
        position: "top-right",
        autoClose: 5000,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  if (currentUser && !currentUser.active) {
    return <ActivationNotice />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Cuộc bỏ phiếu</h1>
        {isAdmin && (
          <Link to="/elections/new">
            <Button variant="primary">
              <FaPlus className="me-2" /> Thêm cuộc bỏ phiếu mới
            </Button>
          </Link>
        )}
      </div>

      <Card className="mb-4">
        <Card.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm cuộc bỏ phiếu..."
              value={pendingSearchTerm}
              onChange={(e) => setPendingSearchTerm(e.target.value)}
            />
            <Form.Group>
              <Form.Select
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
              >
                <option value="">Tất cả các cuộc bỏ phiếu</option>
                <option value="ONGOING">Đang diễn ra</option>
                <option value="UPCOMING">Sắp diễn ra</option>
                <option value="FINISHED">Đã kết thúc</option>
                <option value="CANCELLED">Đã hủy</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </InputGroup>

          <Table hover responsive>
            <thead>
              <tr>
                <th>Chủ đề</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
                {isAdmin && <th>Mã tham gia</th>}

                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr key={election.id}>
                  <td>{election.title}</td>
                  <td>{formatToVietnameseAMPM(election.startTime)}</td>
                  <td>{formatToVietnameseAMPM(election.endTime)}</td>
                  <td>{getStatusBadge(election.status)}</td>
                  {isAdmin && <td>{election.electionCode}</td>}

                  <td>
                    <Link
                      to={`/elections/${election.id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      <FaEye />
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          to={`/elections/${election.id}/edit`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleShowDeleteModal(election)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {elections.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">
                Không tìm thấy cuộc bỏ phiếu nào. Hãy thử tìm kiếm khác hoặc tạo
                cuộc bỏ phiếu mới.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showDeleteModal}
        title="Xóa cuộc bỏ phiếu"
        message={`Bạn có chắc chắn xóa cuộc bỏ phiếu "${electionToDelete?.title}" không? Không thể hoàn tác hành động này.`}
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteElection}
        onCancel={handleCloseDeleteModal}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToastContainer />
    </div>
  );
};

export default Elections;
