import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-city text-primary text-2xl mr-2"></i>
              <span className="font-bold text-xl text-gray-800">CivicVoice</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`${location === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Community Board
              </Link>
              <Link href="/submit" className={`${location === '/submit' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Submit Issue
              </Link>
              <Link href="/about" className={`${location === '/about' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button type="button" className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <span className="sr-only">View notifications</span>
              <i className="fas fa-bell"></i>
            </button>
            <div className="ml-3 relative">
              <button className="bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-2 text-sm font-medium">
                Sign in / Register
              </button>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <span className="sr-only">Open main menu</span>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
