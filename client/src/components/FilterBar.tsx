import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  onFilterChange: (type: string, value: string) => void;
  onSearch: (query: string) => void;
  issueType: string;
  status: string;
  searchQuery: string;
}

export default function FilterBar({
  onFilterChange,
  onSearch,
  issueType,
  status,
  searchQuery,
}: FilterBarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
      <div className="relative flex-grow">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="fas fa-search text-gray-400"></i>
            </span>
            <Input 
              type="text" 
              placeholder="Search issues..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="flex gap-2">
        <Select
          value={issueType}
          onValueChange={(value) => onFilterChange("issueType", value)}
        >
          <SelectTrigger className="border border-gray-300 rounded-md py-2 px-3 bg-white text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="crosswalk">Crosswalk</SelectItem>
            <SelectItem value="pothole">Pothole</SelectItem>
            <SelectItem value="sidewalk">Sidewalk Damage</SelectItem>
            <SelectItem value="streetlight">Street Light</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger className="border border-gray-300 rounded-md py-2 px-3 bg-white text-sm">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="idea_submitted">Idea Submitted</SelectItem>
            <SelectItem value="community_support">Community Support</SelectItem>
            <SelectItem value="email_campaign_active">Email Campaign Active</SelectItem>
            <SelectItem value="official_acknowledgment">Official Acknowledgment</SelectItem>
            <SelectItem value="planning_stage">Planning Stage</SelectItem>
            <SelectItem value="implementation">Implementation</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <i className="fas fa-sliders-h text-gray-500"></i>
        </Button>
      </div>
    </div>
  );
}
