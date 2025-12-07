import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">Welcome to FoodOrder</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            The complete food ordering application with role-based access control. Order from your favorite restaurants
            with ease.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                Login
              </button>
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-lg font-bold text-blue-600 mb-4">RBAC System</h3>
              <p className="text-gray-700">Admin, Manager, and Member roles with different access levels</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Regional Control</h3>
              <p className="text-gray-700">Managers and Members see only their country's data</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Order Management</h3>
              <p className="text-gray-700">Create, view, cancel orders and manage payment methods</p>
            </div>
          </div>

          <div className="mt-16 bg-white p-12 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Demo Credentials</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-left">
                <p className="font-bold text-blue-600">Admin</p>
                <p className="text-sm text-gray-700">Email: nickfury@admin.com</p>
                <p className="text-sm text-gray-700">Password: admin123</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-blue-600">Manager (India)</p>
                <p className="text-sm text-gray-700">Email: captainmarvel@manager.com</p>
                <p className="text-sm text-gray-700">Password: manager123</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-blue-600">Member (India)</p>
                <p className="text-sm text-gray-700">Email: thanos@member.com</p>
                <p className="text-sm text-gray-700">Password: member123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
