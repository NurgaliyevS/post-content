import { FiCalendar, FiCheck } from "react-icons/fi";

function CrossPostingHistory(props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Cross-Posting History</h2>
        <select className="p-2 border rounded-md text-sm">
          <option>All Status</option>
          <option>Scheduled</option>
          <option>Published</option>
          <option>Failed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                Original Post
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                Cross-Posted To
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                Schedule
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3">
                <div className="font-medium">
                  A tool that schedule your posts on Reddit
                </div>
                <div className="text-sm text-gray-500">r/microsaas</div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    r/SideProject
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    r/startups
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    +2 more
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-1" />
                  <span>04/03/2025 10:15</span>
                </div>
              </td>
              <td className="p-3">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  Scheduled
                </span>
              </td>
              <td className="p-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm ml-3">
                  Cancel
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <div className="font-medium">Test post</div>
                <div className="text-sm text-gray-500">r/test</div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    r/webdev
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <FiCheck className="text-green-500 mr-1" />
                  <span>04/01/2025 22:10</span>
                </div>
              </td>
              <td className="p-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Published
                </span>
              </td>
              <td className="p-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CrossPostingHistory;
