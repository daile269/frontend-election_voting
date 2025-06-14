import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Container, Row, Col } from 'react-bootstrap';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={sidebarOpen ? 3 : 1} lg={sidebarOpen ? 2 : 1} className="sidebar">
          <Sidebar isOpen={sidebarOpen} />
        </Col>
        <Col md={sidebarOpen ? 9 : 11} lg={sidebarOpen ? 10 : 11} className="main-content" style={{ marginLeft: sidebarOpen ? 'auto' : '0' }}>
          <Header toggleSidebar={toggleSidebar} />
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;