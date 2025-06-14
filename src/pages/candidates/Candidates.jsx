import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  getCandidateByElectionId,
  getCandidatesPaginated,
} from "../../services/candidateService";
import { getElections } from "../../services/electionService";
import CandidateCard from "../../components/candidates/CandidateCard";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/untils/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ActivationNotice from "../../components/untils/ActivationNotice";
const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const { isAdmin, currentUser } = useAuth();

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin location từ URL

  const query = new URLSearchParams(location.search);
  const size = parseInt(query.get("size"), 10) || 8;
  const page = parseInt(query.get("page"), 10) || 1;
  useEffect(() => {
    setCurrentPage(page);
    const fetchCandidatesPaginated = async () => {
      if (selectedElection) {
        const data = await getCandidateByElectionId(Number(selectedElection));
        setCandidates(data);
        setTotalPages(1);
      } else {
        const data = await getCandidatesPaginated(page, size);
        setCandidates(data.listElements);
        setTotalPages(data.totalPages);
      }
    };

    fetchCandidatesPaginated();
  }, [location.search, selectedElection]);

  // Paginated
  const handlePageChange = (newPage) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newPage);
    queryParams.set("size", size);

    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  useEffect(() => {
    const fetchElections = async () => {
      const data = await getElections();
      setElections(data);
    };
    fetchElections();
  }, []);

  useEffect(() => {
    let filtered = candidates;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((candidate) => {
        const fullName = candidate.fullName?.toLowerCase() || "";
        const email = candidate.email?.toLowerCase() || "";
        return fullName.includes(term) || email.includes(term);
      });
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm]);
  useEffect(() => {
    if (selectedElection) {
      navigate(`${location.pathname}?page=1&size=${size}`);
    }
  }, [selectedElection]);

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
        <h1 className="page-title mb-0">Ứng viên</h1>
        {isAdmin && (
          <Link to="/candidates/new">
            <Button variant="primary">
              <FaPlus className="me-2" /> Thêm ứng viên
            </Button>
          </Link>
        )}
      </div>

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
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={selectedElection}
                  onChange={(e) => setSelectedElection(e.target.value)}
                >
                  <option value="">Tất cả các cuộc bỏ phiếu</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredCandidates.length > 0 ? (
        <Row>
          {filteredCandidates.map((candidate) => (
            <Col md={6} lg={4} xl={3} key={candidate.id} className="mb-4">
              <CandidateCard candidate={candidate} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center p-5">
          <Card.Body>
            <p className="text-muted">
              Không tìm thấy ứng viên. Vui lòng tìm với tên khác
            </p>
            {isAdmin && (
              <Link to="/candidates/new">
                <Button variant="outline-primary">
                  <FaPlus className="me-2" /> Thêm ứng viên
                </Button>
              </Link>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Pagination */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToastContainer />
    </div>
  );
};

export default Candidates;
