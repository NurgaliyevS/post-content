import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function RateLimitPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Rate Limit Exceeded</h2>
          <p className="mt-2 text-sm text-gray-600">
            Too many requests. Please wait a minute before trying again.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Link 
              href="/" 
              className="btn btn-primary"
            >
              Return to Home
            </Link>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>If you continue to see this message, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 