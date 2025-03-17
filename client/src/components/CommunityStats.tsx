import { useQuery } from "@tanstack/react-query";
import { CommunityStats as StatsType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityStats() {
  const { data: stats, isLoading } = useQuery<StatsType>({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch community stats');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800">Community Stats</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">Community Stats</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{stats?.activeIssues || 0}</p>
            <p className="text-sm text-gray-600">Active Issues</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{stats?.emailsSent || 0}</p>
            <p className="text-sm text-gray-600">Emails Sent</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">{stats?.issuesResolved || 0}</p>
            <p className="text-sm text-gray-600">Issues Resolved</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">{stats?.successRate || 0}%</p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
