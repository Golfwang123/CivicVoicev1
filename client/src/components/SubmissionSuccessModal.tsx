import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";
import { Link } from "wouter";

interface SubmissionSuccessModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function SubmissionSuccessModal({ project, onClose }: SubmissionSuccessModalProps) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-check text-green-600 text-2xl"></i>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
      <p className="text-gray-600 mb-6">
        Your email has been sent and your issue has been posted to the community board.
      </p>
      <div className="flex justify-center space-x-4">
        <Link href="/">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={onClose}
          >
            View Community Board
          </Button>
        </Link>
        <Button 
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
