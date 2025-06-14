import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ActivationNotice = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/profile");
  };
  return (
    <div className="text-center mt-5">
      <p className="mb-3 text-muted">Tài khoản của bạn chưa được xác thực.</p>
      <Button variant="warning" onClick={handleNavigate}>
        Xác thực ngay để tham gia hệ thống bỏ phiếu
      </Button>
    </div>
  );
};

export default ActivationNotice;
