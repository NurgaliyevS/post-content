import Link from "next/link";
import ResultsSection from "./ResultsSection";

export default function HeroSection() {
  return (
    <main className="text-center px-4 py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Schedule Reddit posts that drive
        <br />
        traffic to your website
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Turn Reddit into your traffic machine without the headache
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/dashboard" className="btn btn-primary">
          Dashboard →
        </Link>
        <Link href="/demo" className="btn btn-ghost">
          ▶ Demo
        </Link>
      </div>
      <ResultsSection />
    </main>
  );
}