import Image from "next/image";

export default function ResultsSection() {
  return (
    <div className="mt-16 mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-center">Real Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* First Result Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-lg">Top Performing Post</h3>
          </div>
          <div className="p-6">
            <Image
              src="/redditpost1.webp"
              alt="Reddit Post Statistics"
              className="w-full object-contain rounded-lg"
              width={750}
              height={570}
              quality={90}
            />
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-xl font-bold">455K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement Rate</p>
                <p className="text-xl font-bold">94%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments</p>
                <p className="text-xl font-bold">199</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Result Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-lg">High Growth Post</h3>
          </div>
          <div className="p-6">
            <Image
              src="/redditpost2.webp"
              alt="Reddit Post Statistics"
              className="w-full object-contain rounded-lg"
              width={750}
              height={570}
              quality={90}
            />
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-xl font-bold">305K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement Rate</p>
                <p className="text-xl font-bold">93%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments</p>
                <p className="text-xl font-bold">177</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Third Result Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-lg">Consistent Performer</h3>
          </div>
          <div className="p-6">
            <Image
              src="/redditpost3.webp"
              alt="Reddit Post Statistics"
              className="w-full object-contain rounded-lg"
              width={750}
              height={570}
              quality={90}
            />
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-xl font-bold">134K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement Rate</p>
                <p className="text-xl font-bold">85%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments</p>
                <p className="text-xl font-bold">134</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fourth Result Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-lg">Trending Post</h3>
          </div>
          <div className="p-6">
            <Image
              src="/redditpost4.webp"
              alt="Reddit Post Statistics"
              className="w-full object-contain rounded-lg"
              width={750}
              height={570}
              quality={90}
            />
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-xl font-bold">126K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement Rate</p>
                <p className="text-xl font-bold">90%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments</p>
                <p className="text-xl font-bold">66</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Impact Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Total Impact</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-3xl font-bold text-primary">1M+</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Engagement</p>
            <p className="text-3xl font-bold text-primary">90.5%</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Engagement</p>
            <p className="text-3xl font-bold text-primary">1,477</p>
          </div>
        </div>
      </div>
    </div>
  );
}