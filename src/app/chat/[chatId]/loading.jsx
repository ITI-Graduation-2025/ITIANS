// export default function Loading() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
//       <div
//         className="relative inline-block font-bold text-4xl font-sans pb-2 text-[var(--primary)]
//                    bg-gradient-to-r from-current to-current bg-[length:0%_3px] bg-no-repeat bg-bottom
//                    animate-[l2_2s_linear_infinite]"
//       >
//         Loading Chat...
//       </div>
//     </div>
//   );
// }

// src/app/chat/[chatId]/loading.jsx
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-2">
      <div className="h-[85vh] w-full max-w-4xl mx-auto bg-gray-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            <div>
              <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Messages Container Skeleton */}
        <div className="flex-1 overflow-hidden p-4 space-y-3 bg-gray-50">
          {/* Message skeletons */}
          <div className="flex justify-start items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="max-w-xs p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-32 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-end items-start gap-2">
            <div className="max-w-xs p-3 bg-[#901b20] rounded-lg">
              <div className="w-28 h-4 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="w-20 h-4 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="w-10 h-3 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          <div className="flex justify-start items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="max-w-xs p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-40 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
              <div className="w-14 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-end items-start gap-2">
            <div className="max-w-xs p-3 bg-[#901b20] rounded-lg">
              <div className="w-36 h-4 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="w-28 h-4 bg-white/20 rounded animate-pulse mb-1"></div>
              <div className="w-12 h-3 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          <div className="flex justify-start items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="max-w-xs p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="w-8 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="w-full h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading overlay */}
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#901b20] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#901b20] font-medium">Loading chat...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
