import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Layout({ children }) {
  const router = useRouter()
  const isActive = (path) => router.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-base-100 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
              <Image src="/logo.svg" alt="Reddit Scheduler Logo" width={32} height={32} />
              Post Content
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/about') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                }`}
              >
                About
              </Link>
              <Link 
                href="/privacy-policy" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/privacy-policy') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                }`}
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/terms') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                }`}
              >
                Terms
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="btn btn-ghost">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
              }`}
            >
              About
            </Link>
            <Link 
              href="/privacy-policy" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/privacy-policy') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
              }`}
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/terms') ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
              }`}
            >
              Terms
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Reddit Scheduler</h3>
              <p className="text-sm">Schedule and manage your Reddit posts efficiently.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm hover:text-primary">About Us</Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm hover:text-primary">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm">Email: nurgasab@gmail.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-base-300 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Reddit Scheduler. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 