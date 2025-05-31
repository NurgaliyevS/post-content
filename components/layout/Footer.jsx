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
            Post Content
            <br />
            Turn Reddit into your traffic machine without the headache
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Product
          </span>
          <Link
            href="/#features"
            className="text-sm hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/affiliates"
            className="text-sm hover:text-primary transition-colors"
          >
            Affiliates
          </Link>
          {/* DOMINATE ON REDDIT */}
          <Link
            href="https://docs.google.com/document/d/e/2PACX-1vST8ZGrXlWxZR17MRGOgfAJj2lHhRqb3__-WxOZNSezEfA-i9TgBkqAWvoYFqrtU1oC4RKaU9L6mJZM/pub"
            className="text-sm hover:text-primary transition-colors"
            title="Free Guide: How to Dominate on Reddit"
            target="_blank"
          >
            How to Dominate on Reddit
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
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col-reverse md:flex-row items-center gap-2 sm:gap-8">
          <div className="text-xs text-gray-500 md:text-left text-center">
            © 2025 Post Content. All rights reserved.
          </div>
          <div className="text-xs">
            <a
              href="https://github.com/NurgaliyevS/redditscheduler"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-primary text-gray-500"
            >
              Proudly open-source ❤️
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
