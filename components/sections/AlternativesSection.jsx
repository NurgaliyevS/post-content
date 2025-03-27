export default function AlternativesSection() {
    return (
      <section className="py-16 mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Alternatives are expensive.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mx-auto">
          <div className="p-6 rounded-xl border border-red-200 bg-red-50">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Marketing Agencies</span>
              <span className="text-red-500">✕</span>
            </div>
            <p className="text-sm text-gray-600">
              Expensive, $50-200 per post, burning through $4500 to $6500 a
              month.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-red-200 bg-red-50">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Doing it yourself</span>
              <span className="text-red-500">✕</span>
            </div>
            <p className="text-sm text-gray-600">
              Hours lost on researching, planning, writing, posting,
              monitoring, re-purposing
            </p>
          </div>
          <div className="p-6 rounded-xl border border-green-200 bg-green-50">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">RedditScheduler</span>
              <span className="text-green-500">✓</span>
            </div>
            <p className="text-sm text-gray-600">
              Automatically scheduling & publishing posts to subreddits, for a
              monthly subscription
            </p>
          </div>
        </div>
      </section>
    );
  }