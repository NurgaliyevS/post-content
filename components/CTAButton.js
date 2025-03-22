import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function CTAButton({ text = "Get Started", dashboardPath = "/dashboard/onboarding", className = "btn btn-primary" }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const handleClick = () => {
    if (status === "authenticated") {
      router.push(dashboardPath);
    } else {
      signIn("reddit", { callbackUrl: "/dashboard/onboarding" });
    }
  };
  
  return (
    <button 
      onClick={handleClick} 
      className={className}
      disabled={status === "loading"}
    >
      {status === "loading" ? "Loading..." : text + " →"}
    </button>
  );
}
