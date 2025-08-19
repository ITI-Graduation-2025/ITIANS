export function UserInfoSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      {/* Notification Bell Skeleton */}
      <div className="relative">
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
      </div>

      {/* User Dropdown Skeleton */}
      <div className="flex items-center space-x-2">
        {/* Avatar Skeleton */}
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />

        {/* Name Skeleton */}
        <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );
}
