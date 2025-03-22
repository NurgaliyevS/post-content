
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Billing() {
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Billing</h1>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600">Billing interface coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}