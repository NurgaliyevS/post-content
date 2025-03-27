import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="footer text-base-content max-w-5xl mx-auto pb-10">
        <div>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <p>
            RedditScheduler
            <br />
            Turn Reddit into your traffic machine without the headache
          </p>
        </div>
        <div>
          <span className="footer-title">Product</span>
          <Link href="#features" className="link link-hover">
            Features
          </Link>
          <Link href="#pricing" className="link link-hover">
            Pricing
          </Link>
        </div>
        <div>
          <span className="footer-title">Company</span>
          <Link href="/about" className="link link-hover">
            About
          </Link>
        </div>
        <div>
          <span className="footer-title">Legal</span>
          <Link href="/privacy-policy" className="link link-hover">
            Privacy Policy
          </Link>
          <Link href="/terms" className="link link-hover">
            Terms of Service
          </Link>
        </div>
      </footer>
      <footer className="footer py-10 border-t text-base-content border-base-300 max-w-5xl mx-auto flex items-center justify-center">
        <div className="text-sm text-center text-gray-500">
          © 2025 RedditScheduler. All rights reserved.
        </div>
      </footer>
    </>
  );
}
