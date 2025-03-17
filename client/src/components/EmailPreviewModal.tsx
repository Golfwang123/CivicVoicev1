import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Project, EmailSubmission } from "@/lib/types";

interface EmailPreviewModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailPreviewModal({ project, isOpen, onClose }: EmailPreviewModalProps) {
  const { toast } = useToast();
  const [emailContent, setEmailContent] = useState(project.emailTemplate);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const emailData: EmailSubmission = {
        projectId: project.id,
        customContent: emailContent !== project.emailTemplate ? emailContent : undefined,
        senderEmail: senderEmail || undefined,
        senderName: senderName || undefined,
      };
      
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send email");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Show success message and invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setShowSuccess(true);
    },
  });
  
  // Handle email tone adjustment
  const handleToneChange = async (tone: string) => {
    try {
      const response = await fetch("/api/regenerate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailBody: project.emailTemplate,
          tone,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to regenerate email");
      }
      
      const data = await response.json();
      setEmailContent(data.emailBody);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to adjust email tone. Please try again.",
      });
    }
  };
  
  // Handle send email
  const handleSendEmail = () => {
    if (!validateEmail(senderEmail) && senderEmail !== "") {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address or leave it blank.",
      });
      return;
    }
    
    sendEmailMutation.mutate();
  };
  
  // Email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Render success message
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">Your email has been sent. Your support helps improve our community.</p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Send Email to Support This Issue</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <i className="fas fa-times text-xl"></i>
          </Button>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
              <p className="text-sm text-gray-500">{project.description}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700">To:</Label>
                  <Input
                    type="text"
                    value={project.emailRecipient}
                    className="mt-1 bg-white"
                    readOnly
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700">Subject:</Label>
                  <Input
                    type="text"
                    value={project.emailSubject}
                    className="mt-1 bg-white"
                    readOnly
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700">Email Body:</Label>
                  <Textarea
                    rows={10}
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="mt-1 bg-white"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700">Email Tone Adjustment:</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={null}
                      className="px-3 py-1 bg-primary text-white text-xs rounded-full"
                      onClick={() => handleToneChange("professional")}
                    >
                      Professional
                    </Button>
                    <Button
                      size="sm"
                      variant={null}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300"
                      onClick={() => handleToneChange("formal")}
                    >
                      Formal
                    </Button>
                    <Button
                      size="sm"
                      variant={null}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300"
                      onClick={() => handleToneChange("assertive")}
                    >
                      Assertive
                    </Button>
                    <Button
                      size="sm"
                      variant={null}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300"
                      onClick={() => handleToneChange("concerned")}
                    >
                      Concerned
                    </Button>
                    <Button
                      size="sm"
                      variant={null}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300"
                      onClick={() => handleToneChange("personal")}
                    >
                      Personal
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <div>
                    <Label htmlFor="senderName">Your Name (Optional):</Label>
                    <Input
                      id="senderName"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="mt-1"
                      placeholder="How you'd like to sign the email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="senderEmail">Your Email (Optional):</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="mt-1"
                      placeholder="For email confirmation"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-2"
                disabled={sendEmailMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleSendEmail}
                disabled={sendEmailMutation.isPending}
              >
                <i className="fas fa-paper-plane mr-2"></i>
                {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
