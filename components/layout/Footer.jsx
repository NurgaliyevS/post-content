import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="footer p-10 bg-base-200 text-base-content">
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
            Automating your Reddit presence
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
      <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
        <div className="text-sm">
          © 2025 RedditScheduler. All rights reserved.
        </div>
      </footer>
    </>
  );
}