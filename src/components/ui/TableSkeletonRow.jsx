// components/TableSkeletonRow.jsx
export default function TableSkeletonRow() {
  return (
    <tr className="border-t animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
      </td>
    </tr>
  );
}
