import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Scheduling() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  return (
    <DashboardLayout loading={loading}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Schedule Your Reddit Posts</h1>
        
        {/* Scheduling content will go here */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600">Scheduling interface coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}