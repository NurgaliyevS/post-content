import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
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
        <span className="font-bold text-xl">RedditScheduler</span>
      </div>
      <div className="flex gap-4">
        <Link href="#features" className="link link-hover">
          Features
        </Link>
        <Link href="#pricing" className="link link-hover">
          Pricing
        </Link>
      </div>
    </nav>
  );
}