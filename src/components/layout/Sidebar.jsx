import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaVoteYea,
  FaUsers,
  FaUserTie,
  FaPoll,
  FaChartBar,
  FaSearch,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { isAdmin } = useAuth();

  return (
    <div
      className={`d-flex flex-column p-3 text-white ${
        isOpen ? "" : "text-center"
      }`}
    >
      <div className="text-center mb-4">
        <h3 className={`${isOpen ? "" : "d-none"}`}>
          <Navbar.Brand
            href={isAdmin ? "/" : "user-dashboard"}
            className="ms-2 fw-bold"
          >
            <FaVoteYea className="me-2" />
            E-VOTING
          </Navbar.Brand>
        </h3>
        <div className={`${isOpen ? "d-none" : ""}`}>
          <FaVoteYea size={28} />
        </div>
      </div>
      <Nav className="flex-column mb-auto">
        {isAdmin ? (
          <Nav.Item>
            <NavLink to="/" className="nav-link">
              <FaHome className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>
                Quản trị chung
              </span>
            </NavLink>
          </Nav.Item>
        ) : (
          <Nav.Item>
            <NavLink to="/user-dashboard" className="nav-link">
              <FaHome className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>Tổng quan</span>
            </NavLink>
          </Nav.Item>
        )}

        {isAdmin && (
          <Nav.Item>
            <NavLink to="/elections" className="nav-link">
              <FaPoll className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>Cuộc bỏ phiếu</span>
            </NavLink>
          </Nav.Item>
        )}

        {!isAdmin && (
          <Nav.Item>
            <NavLink to="/user-elections" className="nav-link">
              <FaPoll className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>
                Cuộc bỏ phiếu có thể tham gia
              </span>
            </NavLink>
          </Nav.Item>
        )}

        <Nav.Item>
          <NavLink to="/candidates" className="nav-link">
            <FaUserTie className="icon" />
            <span className={`${isOpen ? "" : "d-none"}`}>Ứng viên</span>
          </NavLink>
        </Nav.Item>

        {isAdmin && (
          <Nav.Item>
            <NavLink to="/votes" className="nav-link">
              <FaVoteYea className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>Phiếu bầu</span>
            </NavLink>
          </Nav.Item>
        )}

        {!isAdmin && (
          <Nav.Item>
            <NavLink to="/vote-history" className="nav-link">
              <FaVoteYea className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>
                Lịch sử bỏ phiếu
              </span>
            </NavLink>
          </Nav.Item>
        )}

        <Nav.Item>
          <NavLink to="/results" className="nav-link">
            <FaChartBar className="icon" />
            <span className={`${isOpen ? "" : "d-none"}`}>Kết quả</span>
          </NavLink>
        </Nav.Item>

        {isAdmin && (
          <Nav.Item>
            <NavLink to="/users" className="nav-link">
              <FaUsers className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>Người dùng</span>
            </NavLink>
          </Nav.Item>
        )}

        {!isAdmin && (
          <Nav.Item>
            <NavLink to="/join-election" className="nav-link">
              <FaSearch className="icon" />
              <span className={`${isOpen ? "" : "d-none"}`}>
                Tham gia cuộc bỏ phiếu
              </span>
            </NavLink>
          </Nav.Item>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
