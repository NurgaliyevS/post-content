import { FiCheck, FiX } from "react-icons/fi";

export const SuccessToast = ({ successful }) => {
  return (
    <div className="flex flex-col">
      <div className="space-y-1">
        <div className="flex flex-col gap-2">
          <span>Successfully scheduled for: </span>
          {successful.map((item, index) => (
            <div className="flex items-center gap-2" key={`success-${index}`}>
              <div className="text-green-600 bg-green-100 rounded-full p-0.5">
                <FiCheck className="w-4 h-4" />
              </div>
              <span>{item.subreddit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WarningToast = ({ successful, failed }) => (
  <div className="flex flex-col">
    <div className="space-y-1">
      <div className="flex flex-col gap-2">
        <span>Successfully scheduled for: </span>
        {successful.map((item, index) => (
          <div className="flex items-center gap-2" key={`success-${index}`}>
            <div className="text-green-600 bg-green-100 rounded-full p-0.5">
              <FiCheck className="w-4 h-4" />
            </div>
            <span>{item.subreddit}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t pt-2">
        <span>Failed to schedule for: </span>
        {failed.map((item, index) => (
          <div key={`failed-${index}`} className="flex items-center gap-2">
            <div className="text-red-600 bg-red-100 rounded-full p-0.5">
              <FiX className="w-4 h-4" />
            </div>
            <span>
              {item.subreddit} - ({item.reason})
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ErrorToast = ({ failed }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 font-medium">
      <span>Failed to schedule for: </span>
    </div>
    <div className="space-y-1">
      {failed.map((item, index) => (
        <div key={`failed-${index}`} className="flex items-center gap-2">
          <div className="text-red-600 bg-red-100 rounded-full p-0.5">
            <FiX className="w-4 h-4" />
          </div>
          <span>
            {item.subreddit} - ({item.reason})
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const showNotification = (type, results, toast) => {
  const { successful, failed } = results;

  switch (type) {
    case "success":
      toast.success(<SuccessToast successful={successful} />, {
        autoClose: 10000,
        closeButton: true,
        className: "bg-green-50 border-l-4 border-green-500",
      });
      break;
    case "warning":
      toast.warning(
        <WarningToast successful={successful} failed={failed} />,
        {
          autoClose: 10000,
          closeButton: true,
          className: "bg-amber-50 border-l-4 border-amber-500",
        }
      );
      break;
    case "error":
      toast.error(<ErrorToast failed={failed} />, {
        autoClose: 10000,
        closeButton: true,
        className: "bg-red-50 border-l-4 border-red-500",
      });
      break;
    default:
      break;
  }
}; 