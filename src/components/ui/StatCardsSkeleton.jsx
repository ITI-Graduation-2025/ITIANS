// components/StatCardsSkeleton.jsx
export default function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-lg shadow bg-white flex flex-col items-center justify-center"
        >
          <div className="w-6 h-6 bg-gray-200 rounded-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}
