import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const withSetupCheck = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [setupStatus, setSetupStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkSetupStatus = async () => {
        if (status === "loading") return;
        if (!session?.user) return;

        // Skip setup check if already on setup page
        if (router.pathname === "/dashboard/setup") {
          setLoading(false);
          return;
        }

        try {
          const response = await fetch('/api/user/setup-status');
          if (response.ok) {
            const data = await response.json();
            setSetupStatus(data);
            
            // Redirect to setup if not completed
            if (!data.setup_completed) {
              router.push('/dashboard/setup');
              return;
            }
          }
        } catch (error) {
          console.error('Error checking setup status:', error);
        } finally {
          setLoading(false);
        }
      };

      checkSetupStatus();
    }, [session, status, router]);

    if (loading || status === "loading") {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    if (session?.user) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withSetupCheck; 