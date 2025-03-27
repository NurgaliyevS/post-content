export default function FeaturesSection() {
    return (
      <section id="features" className="py-16 px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 mx-auto">
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="text-primary text-2xl mb-2">📊</div>
              <h3 className="card-title">Scheduling</h3>
              <p className="text-sm text-gray-600">
                Publish when your target audience is most active
              </p>
            </div>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="text-primary text-2xl mb-2">🎯</div>
              <h3 className="card-title">Cross-Posting</h3>
              <p className="text-sm text-gray-600">
                Post to multiple subreddits with one click
              </p>
            </div>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="text-primary text-2xl mb-2">📈</div>
              <h3 className="card-title">Hook Generator</h3>
              <p className="text-sm text-gray-600">
                Viral templates for your posts
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }