import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push("/dashboard/onboarding");
    } else {
      signIn("reddit", { callbackUrl: "/dashboard/onboarding" });
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 mx-auto">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="font-bold text-lg md:text-xl">RedditScheduler</span>
      </div>
      <div className="flex gap-4">
        <Link href="#features" className="link link-hover hidden md:inline">
          Features
        </Link>
        <Link href="#pricing" className="link link-hover">
          Pricing
        </Link>
        <button onClick={handleClick} className="link link-hover">
          {session ? "Dashboard" : "Login"}
        </button>
      </div>
    </nav>
  );
}
