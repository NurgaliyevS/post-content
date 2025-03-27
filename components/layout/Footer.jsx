import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <section className="py-16 px-4 mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-8 max-w-3xl mx-auto py-8">
        <div className="flex flex-col gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <p className="text-sm text-gray-600">
            RedditScheduler
            <br />
            Turn Reddit into your traffic machine without the headache
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Product
          </span>
          <Link
            href="#features"
            className="text-sm hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Company
          </span>
          <Link
            href="/about"
            className="text-sm hover:text-primary transition-colors"
          >
            About
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Legal
          </span>
          <Link
            href="/privacy-policy"
            className="text-sm hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-xs text-center text-gray-500">
            © 2025 RedditScheduler. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
