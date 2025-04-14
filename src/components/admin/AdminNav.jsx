import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminNav() {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Rooms', path: '/admin/rooms', icon: '🏠' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Promotions', path: '/admin/promotions', icon: '🎁' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Reports', path: '/admin/reports', icon: '📈' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  return (
    <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                router.pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span className="mr-3">🏠</span>
          Back to Home
        </Link>
      </div>
    </nav>
  );
} 