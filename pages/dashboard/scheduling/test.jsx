import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TestScheduling() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  console.log('bye');

  const testData = {
    community: "r/test",
    title: "Let me cook",
    text: `**First bold line**,
    \n*Second italic line*,
    \n[Test link](https://example.com),\n`,
    selectedDate: new Date().toISOString().split('T')[0], 
    selectedTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  };

  const handleTestSubmit = async () => {
    if (!session) {
      setError("Please sign in first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/post/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule post');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout loading={status === "loading"}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Post Scheduling API</h1>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Test Data:</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>

          {!session ? (
            <button 
              onClick={() => signIn()}
              className="btn btn-primary w-full"
            >
              Sign In to Test
            </button>
          ) : (
            <button 
              onClick={handleTestSubmit}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Testing...' : 'Test Submit'}
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <h3 className="font-semibold">Success Response:</h3>
              <pre className="mt-2 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 