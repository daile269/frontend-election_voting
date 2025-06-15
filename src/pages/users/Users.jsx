import { useState, useEffect } from "react";
import { Card, Button, Table, Badge, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { deleteUser, getUsersPaginated } from "../../services/userService";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/untils/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // set list
  const query = new URLSearchParams(location.search);
  const size = parseInt(query.get("size"), 10) || 8;
  const page = parseInt(query.get("page"), 10) || 1;
  useEffect(() => {
    setCurrentPage(page);
    const fetchUsers = async () => {
      const data = await getUsersPaginated(
        page,
        size,
        searchName,
        searchUsername,
        searchEmail,
        selectedRole
      );
      setUsers(data.content);
      setTotalPages(data.totalPages);
    };

    fetchUsers();
  }, [location.search, page, size]);
  // Paginated
  const handlePageChange = (newPage) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newPage);
    queryParams.set("size", size);

    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        toast.success("Người dùng đã được xóa thành công!");
        handleSearch(currentPage);
      } catch (error) {
        console.log(error);
        toast.error("Xóa người dùng thất bại. Vui lòng thử lại!");
      } finally {
        handleCloseDeleteModal();
      }
    }
  };

  const handleSearch = (pageNumber) => {
    const queryParams = new URLSearchParams();

    if (searchName) queryParams.set("name", searchName);
    if (searchUsername) queryParams.set("username", searchUsername);
    if (searchEmail) queryParams.set("email", searchEmail);
    if (selectedRole) queryParams.set("role", selectedRole);

    queryParams.set("page", pageNumber);
    queryParams.set("size", size);

    navigate(`${location.pathname}?${queryParams.toString()}`);
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
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Người dùng</h1>
        <Link to="/users/new">
          <Button variant="primary">
            <FaPlus className="me-2" /> Thêm người dùng
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Control
                placeholder="Tên đầy đủ"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Tên đăng nhập"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                <option value="ADMIN">Người quản trị</option>
                <option value="USER">Người dùng</option>
              </Form.Select>
            </Col>
            <Col md={1}>
              <Button variant="primary" onClick={() => handleSearch(1)}>
                <FaSearch />
              </Button>
            </Col>
          </Row>

          <Table hover responsive>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Thời gian tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.urlAvatar}
                      alt={user.fullName}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "8px",
                        verticalAlign: "middle",
                      }}
                    />
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === "ADMIN" ? "primary" : "success"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={user.active === true ? "success" : "danger"}>
                      {user.active === true ? "Đã xác thực" : "Chưa xác thực"}
                    </Badge>
                  </td>
                  <td>
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      <FaEdit />
                    </Link>
                    {user.id !== currentUser?.id && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleShowDeleteModal(user)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {users.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">Không tìm thấy người dùng</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showDeleteModal}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${userToDelete?.fullName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteUser}
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

export default Users;
