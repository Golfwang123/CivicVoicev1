import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities?limit=5');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
  });

  // Function to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email_sent':
        return <div className="flex-shrink-0 rounded-full bg-blue-100 p-1">
          <i className="fas fa-envelope text-blue-600 text-xs"></i>
        </div>;
      case 'status_change':
        return <div className="flex-shrink-0 rounded-full bg-green-100 p-1">
          <i className="fas fa-check text-green-600 text-xs"></i>
        </div>;
      case 'project_created':
        return <div className="flex-shrink-0 rounded-full bg-purple-100 p-1">
          <i className="fas fa-plus text-purple-600 text-xs"></i>
        </div>;
      case 'upvote':
        return <div className="flex-shrink-0 rounded-full bg-yellow-100 p-1">
          <i className="fas fa-arrow-up text-yellow-600 text-xs"></i>
        </div>;
      default:
        return <div className="flex-shrink-0 rounded-full bg-gray-100 p-1">
          <i className="fas fa-info text-gray-600 text-xs"></i>
        </div>;
    }
  };

  // Format relative time
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-4">
          <ul className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-800">Recent Activity</h2>
      </div>
      <div className="p-4">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No recent activities.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start space-x-3">
                {getActivityIcon(activity.activityType)}
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{activity.actorName || 'Anonymous User'}</span>{' '}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(activity.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
