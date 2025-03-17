import { useState } from "react";
import { useLocation } from "wouter";
import IssueSubmissionModal from "@/components/IssueSubmissionModal";

export default function IssueSubmissionForm() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [, navigate] = useLocation();

  // When modal is closed, redirect back to community board
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return <IssueSubmissionModal isOpen={isModalOpen} onClose={handleModalClose} />;
}
