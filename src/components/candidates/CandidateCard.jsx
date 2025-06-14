import { Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaTrash, FaVoteYea } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { deleteCandidateFromElection } from "../../services/electionService";
import ConfirmModal from "../common/ConfirmModal";
import { createVote } from "../../services/VoteService";

const CandidateCard = ({
  candidate,
  election,
  setActiveTab,
  candidateData,
  canVote,
}) => {
  const location = useLocation();
  const showVoteButton = location.pathname.includes("/elections");
  const { isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const [showVoteConfirm, setShowVoteConfirm] = useState(false);
  const [voteChoice, setVoteChoice] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleDeleteCandidate = async () => {
    try {
      await deleteCandidateFromElection(id, candidate.id);
      toast.success("Đã xóa ứng viên khỏi cuộc bầu cử", {
        position: "top-right",
        autoClose: 5000,
      });
      setActiveTab("candidates");
      candidateData();
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại!");
    }
  };
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  // Confirm vote
  const handleShowVoteConfirm = () => setShowVoteConfirm(true);
  const handleCloseVoteConfirm = () => setShowVoteConfirm(false);

  const handleConfirmVote = async () => {
    const voteData = {
      candidateId: candidate.id,
      electionId: election.id,
    };
    try {
      const data = await createVote(voteData, voteChoice);
      if (parseInt(data.code) === 200) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
        setHasVoted(true);
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowVoteConfirm(false);
    }
  };
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={candidate.urlAvatar}
        alt={candidate.fullName}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>Họ và tên: {candidate.fullName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Email :{candidate.email}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Số điện thoại: {candidate.phone}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Địa chỉ: {candidate.address}
        </Card.Subtitle>
        <Card.Text className="mt-2">
          Giới thiệu:{" "}
          {candidate.description.length > 100
            ? `${candidate.description.substring(0, 100)}...`
            : candidate.description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white">
        <Link to={`/candidates/${candidate.id}`}>
          <Button variant="outline-primary" size="sm" className="w-100">
            <FaEye className="me-2" /> Xem thông tin chi tiết
          </Button>
        </Link>
        {showVoteButton && isAdmin && (
          <>
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2 w-100"
              onClick={handleShowDeleteModal}
            >
              <FaTrash className="me-2" /> Xóa ứng viên khỏi cuộc bầu cử
            </Button>
          </>
        )}

        {!isAdmin &&
          showVoteButton &&
          election.status === "ONGOING" &&
          (canVote ? (
            <div className="d-flex gap-2">
              <Button
                variant="success"
                className="mt-2 w-50"
                onClick={() => {
                  setVoteChoice(true);
                  handleShowVoteConfirm();
                }}
                disabled={hasVoted}
              >
                <FaVoteYea /> Bỏ phiếu chọn
              </Button>
              <Button
                variant="danger"
                className="mt-2 w-50"
                onClick={() => {
                  setVoteChoice(false);
                  handleShowVoteConfirm();
                }}
                disabled={hasVoted}
              >
                <FaVoteYea /> Không chọn
              </Button>
            </div>
          ) : (
            <div className="text-danger text-center mt-2">
              Bạn không có quyền bỏ phiếu trong cuộc bỏ phiếu này. Vui lòng liên
              hệ Người quản trị để được cấp quyền
            </div>
          ))}
      </Card.Footer>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa ứng viên này khỏi cuộc bầu cử?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteCandidate();
              handleCloseDeleteModal();
            }}
          >
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmModal
        show={showVoteConfirm}
        title="Xác nhận bỏ phiếu"
        message={`Bạn có chắc chắn muốn bỏ phiếu cho ứng viên "${candidate.fullName}" không? Khi đã xác nhận, bạn sẽ không thể thay đổi lựa của mình!`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        confirmVariant="success"
        onConfirm={handleConfirmVote}
        onCancel={handleCloseVoteConfirm}
      />
    </Card>
  );
};

export default CandidateCard;
