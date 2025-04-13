'use client';

import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <header className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg font-medium text-gray-900">Welcome to the administrative dashboard. From here you can manage brokers and users.</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-4">
        {/* User Management Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">User Management</h2>
          <p className="mb-6 text-gray-800">Manage system users, reset passwords, and control access permissions.</p>
          <div className="flex flex-col space-y-3">
            <Link href="/dashboard/admin/users" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center">
              View All Users
            </Link>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Reset User Password
            </button>
          </div>
        </div>

        {/* Broker Management Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Broker Management</h2>
          <p className="mb-6 text-gray-800">Add new brokers to the system and manage existing broker relationships.</p>
          <div className="flex flex-col space-y-3">
            <Link href="/dashboard/admin/brokers" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center">
              View All Brokers
            </Link>
          </div>
        </div>
      </div>

      <main className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Add a New Broker</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="brokerName" className="block text-sm font-medium text-gray-800 mb-1">
              Broker Name
            </label>
            <input
              type="text"
              id="brokerName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="brokerEmail" className="block text-sm font-medium text-gray-800 mb-1">
              Broker Email
            </label>
            <input
              type="email"
              id="brokerEmail"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="brokerCompany" className="block text-sm font-medium text-gray-800 mb-1">
              Broker Company
            </label>
            <input
              type="text"
              id="brokerCompany"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Broker
          </button>
        </form>
      </main>
      <footer className="mt-8 text-sm text-gray-700">
        &copy; 2025 QuikBroker. All rights reserved.
      </footer>
    </div>
  );
}
