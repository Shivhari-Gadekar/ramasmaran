// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          {/* Logo / App Name */}
          <span className="text-lg font-semibold text-indigo-600">
            रामस्मरण
          </span>

          {/* Links */}
          <nav className="flex space-x-6 text-gray-600 text-sm">
            <a href="/" className="hover:text-indigo-600">
              Home
            </a>
            <a href="/leaderboard" className="hover:text-indigo-600">
              Leaderboard
            </a>
            <a href="/about" className="hover:text-indigo-600">
              About
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} रामस्मरण. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
