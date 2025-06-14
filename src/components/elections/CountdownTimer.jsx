import React, { useEffect, useState } from "react";
import { Card, Alert, Button, Badge } from "react-bootstrap";

function CountdownTimer({ startTime, endTime, status }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const days = Math.floor(totalSeconds / (3600 * 24));
    return `${days > 0 ? days + " ngày " : ""}${
      hours < 10 ? "0" + hours : hours
    }:${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  let content;
  if (status === "UPCOMING") {
    content = (
      <Alert variant="warning" className="text-center">
        <h5>Cuộc bỏ phiếu sẽ bắt đầu sau:</h5>
        <h4>{formatTimeLeft(start - now)}</h4>
      </Alert>
    );
  } else if (status === "ONGOING") {
    content = (
      <Alert variant="success" className="text-center">
        <h5>Thời gian còn lại:</h5>
        <h4>{formatTimeLeft(end - now)}</h4>
      </Alert>
    );
  } else {
    content = (
      <Alert variant="danger" className="text-center">
        <h5>Cuộc bỏ phiếu đã kết thúc.</h5>
      </Alert>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Body className="text-center">{content}</Card.Body>
    </Card>
  );
}

export default CountdownTimer;
