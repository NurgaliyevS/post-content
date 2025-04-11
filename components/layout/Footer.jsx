import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <section className="py-4 px-4 mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-8 max-w-4xl mx-auto py-10">
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
          <Link
            href="/privacy-policy"
            className="text-sm hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm hover:text-primary transition-colors"
          >
            Terms
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            More
          </span>
          <a
            href="https://x.com/tech_nurgaliyev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            X (Twitter)
          </a>
          <a
            href="https://mvpagency.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            MVP Agency
          </a>
          <a
            href="https://redditagency.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            Reddit Agency
          </a>
          <a
            href="https://github.com/NurgaliyevS/redditscheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-xs text-center text-gray-500">
            © 2025 RedditScheduler. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
