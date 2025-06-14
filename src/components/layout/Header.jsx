import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaBars, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="mb-4 border-bottom shadow-sm">
      <Container fluid>
        <Nav.Link onClick={toggleSidebar} className="text-dark mr-3">
          <FaBars />
        </Nav.Link>
        <Navbar.Brand
          href={isAdmin ? "/" : "user-dashboard"}
          className="ms-2 fw-bold"
        >
          Hệ thống quản lý bỏ phiếu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <NavDropdown
              title={
                <span>
                  {/* <FaUser className="me-1" />  */}
                  <img
                    src={currentUser.urlAvatar}
                    alt={currentUser.username}
                    className="img-fluid rounded-circle me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  {currentUser?.fullName}
                </span>
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                <FaUser className="me-2" /> Thông tin tài khoản
              </NavDropdown.Item>
              <NavDropdown.Item href="#settings">
                <FaCog className="me-2" /> Cài đặt
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Đăng xuất
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
