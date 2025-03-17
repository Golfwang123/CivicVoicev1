import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Project } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";
import FilterBar from "@/components/FilterBar";
import MapComponent from "@/components/MapComponent";
import CommunityStats from "@/components/CommunityStats";
import RecentActivity from "@/components/RecentActivity";
import IssueSubmissionModal from "@/components/IssueSubmissionModal";
import { Button } from "@/components/ui/button";

export default function CommunityBoard() {
  const [issueType, setIssueType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  
  const itemsPerPage = 10;

  // Fetch projects with filters
  const { data: projects = [], isLoading: isProjectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', issueType, status, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (issueType && issueType !== 'all') params.append('issueType', issueType);
      if (status && status !== 'all') params.append('status', status);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = projects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Filter handlers
  const handleFilterChange = (type: string, value: string) => {
    if (type === 'issueType') setIssueType(value);
    else if (type === 'status') setStatus(value);
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when search changes
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Community Board */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Community Board</h1>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setShowSubmissionModal(true)}
              >
                <i className="fas fa-plus mr-2"></i>
                Submit New Issue
              </Button>
            </div>
            
            {/* Filter Bar */}
            <FilterBar 
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              issueType={issueType}
              status={status}
              searchQuery={searchQuery}
            />

            {/* Project Cards */}
            <div className="space-y-6 mt-6">
              {isProjectsLoading ? (
                <div className="text-center py-10">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : paginatedProjects.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No projects found matching your criteria.</p>
                </div>
              ) : (
                paginatedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        page === i + 1 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Map and Stats */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Map */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-800">Issue Map</h2>
            </div>
            <div className="h-[300px]">
              <MapComponent projects={projects} />
            </div>
          </div>

          {/* Community Stats */}
          <CommunityStats />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>

      {/* Issue Submission Modal */}
      {showSubmissionModal && (
        <IssueSubmissionModal 
          isOpen={showSubmissionModal} 
          onClose={() => setShowSubmissionModal(false)} 
        />
      )}
    </main>
  );
}
