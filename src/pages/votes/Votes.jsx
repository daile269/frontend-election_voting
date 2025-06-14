import { useState, useEffect } from "react";
import { Card, Table, Form, InputGroup, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

import { getVotes, getVotesPaginated } from "../../services/VoteService";
import { getElections } from "../../services/electionService";
import { getCandidates } from "../../services/CandidateService";
import { getUsers } from "../../services/userService";
import Pagination from "../../components/untils/Pagination";
import { useNavigate, useLocation } from "react-router-dom";

const Votes = () => {
  const [votes, setVotes] = useState([]);
  const [votesTotal, setVotesTotal] = useState([]);
  const [filteredVotes, setFilteredVotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin location từ URL

  const query = new URLSearchParams(location.search);
  const size = parseInt(query.get("size"), 10) || 8;
  const page = parseInt(query.get("page"), 10) || 1;

  useEffect(() => {
    setCurrentPage(page);
    const fetchVotes = async () => {
      const data = await getVotesPaginated(page, size);
      setVotes(data.listElements);
      setTotalPages(data.totalPages);
    };

    fetchVotes();
  }, [location.search]);
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
    const fetchCandidates = async () => {
      const data = await getCandidates();
      setCandidates(data);
    };
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    const fetchVoteTotal = async () => {
      const data = await getVotes();
      setVotesTotal(data);
    };
    fetchVoteTotal();
    fetchUsers();
    fetchElections();
    fetchCandidates();
  }, []);

  useEffect(() => {
    // Filter votes based on search term and selected filters
    let filtered = [...votes];

    if (searchTerm) {
      filtered = filtered.filter((vote) =>
        String(vote.id).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedElection) {
      filtered = filtered.filter(
        (vote) => vote.electionId === Number(selectedElection)
      );
    }

    setFilteredVotes(filtered);
  }, [searchTerm, selectedElection, votes]);

  const getElectionTitle = (electionId) => {
    const election = elections.find((e) => e.id === electionId);
    return election ? election.title : "Unknown Election";
  };

  const getCandidateName = (candidateId) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.fullName : "Unknown Candidate";
  };
  const getNameUser = (userId) => {
    const user = users.find((c) => c.id === userId);
    return user ? user.fullName : "Unknown User";
  };
  return (
    <div>
      <h1 className="page-title">Phiếu bầu</h1>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo mã phiếu bầu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Select
                  value={selectedElection}
                  onChange={(e) => setSelectedElection(e.target.value)}
                >
                  <option value="">Tất cả cuộc bỏ phiếu</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Table hover responsive>
            <thead>
              <tr>
                <th>Mã phiếu bầu</th>
                <th>Cuộc bỏ phiếu</th>
                <th>Ứng viên</th>
                <th>Người bỏ phiếu</th>
                <th>Thời gian bỏ phiếu</th>
              </tr>
            </thead>
            <tbody>
              {filteredVotes.map((vote) => (
                <tr key={vote.id}>
                  <td>{vote.id}</td>
                  <td>
                    <Link to={`/elections/${vote.electionId}`}>
                      {getElectionTitle(vote.electionId)}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/candidates/${vote.candidateId}`}>
                      {getCandidateName(vote.candidateId)}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/users/${vote.userId}`}>
                      {getNameUser(vote.userId)}
                    </Link>
                  </td>
                  <td>{new Date(vote.voteTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredVotes.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">
                Không có phiếu bầu trong trang này, hãy thử tìm kiếm với tiêu
                chí khác
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Thống kê </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h3>{votesTotal.length}</h3>
                  <p className="text-muted mb-0">Tổng số phiếu bầu</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h3>{users.length}</h3>
                  <p className="text-muted mb-0">Số người dùng </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h3>{elections.length}</h3>
                  <p className="text-muted mb-0">Số cuộc bỏ phiếu</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <h3>{candidates.length}</h3>
                  <p className="text-muted mb-0">Số ứng viên</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Votes;
