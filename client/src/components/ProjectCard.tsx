import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { queryClient } from "@/lib/queryClient";
import EmailPreviewModal from "@/components/EmailPreviewModal";
import { useToast } from "@/hooks/use-toast";

// Map progress status to display text and percentage
const progressMap: Record<string, { text: string; percentage: number }> = {
  idea_submitted: { text: "Idea Submitted", percentage: 15 },
  community_support: { text: "Community Support", percentage: 35 },
  email_campaign_active: { text: "Email Campaign Active", percentage: 50 },
  official_acknowledgment: { text: "Official Acknowledgment", percentage: 65 },
  planning_stage: { text: "Planning Stage", percentage: 80 },
  implementation: { text: "Implementation", percentage: 90 },
  completed: { text: "Completed", percentage: 100 },
};

// Map issue types to colors
const typeColorMap: Record<string, string> = {
  crosswalk: "bg-blue-100 text-blue-800",
  pothole: "bg-red-100 text-red-800",
  sidewalk: "bg-green-100 text-green-800",
  streetlight: "bg-yellow-100 text-yellow-800",
  other: "bg-purple-100 text-purple-800",
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Format issue type for display
  const formatIssueType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${project.id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upvote project");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Success!",
        description: "Your upvote has been recorded.",
      });
    },
  });
  
  const handleUpvote = () => {
    upvoteMutation.mutate();
  };
  
  const handleEmailClick = () => {
    setIsEmailModalOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColorMap[project.issueType] || "bg-gray-100 text-gray-800"} mb-2`}>
                {formatIssueType(project.issueType)}
              </span>
              <h3 
                className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{project.description.length > 150 
                ? `${project.description.substring(0, 150)}...` 
                : project.description}
              </p>
            </div>
            <div className="flex items-center text-gray-700">
              <button 
                className={`flex flex-col items-center ${upvoteMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary transition-colors'}`}
                onClick={handleUpvote}
                disabled={upvoteMutation.isPending}
              >
                <i className="fas fa-arrow-up text-xl"></i>
                <span className="text-xs font-semibold mt-1">{project.upvotes}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs font-medium text-gray-700">
                {progressMap[project.progressStatus]?.text || "Unknown Status"}
              </span>
            </div>
            <Progress 
              value={progressMap[project.progressStatus]?.percentage || 0} 
              className="h-2.5 bg-gray-200"
            />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <i className="fas fa-envelope mr-1"></i>
                {project.emailsSent} emails sent
              </span>
              <span className="flex items-center">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {project.location}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                className="text-xs py-1.5"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <i className="fas fa-eye mr-1"></i>
                View Details
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors text-xs py-1.5"
                onClick={handleEmailClick}
              >
                <i className="fas fa-envelope mr-1"></i>
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isEmailModalOpen && (
        <EmailPreviewModal 
          project={project}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </>
  );
}
