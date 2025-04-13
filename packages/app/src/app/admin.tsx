export default function AdminHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <header className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">Manage brokers and streamline operations.</p>
      </header>
      <main className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add a New Broker</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="brokerName" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="brokerEmail" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="brokerCompany" className="block text-sm font-medium text-gray-700">
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
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Broker
          </button>
        </form>
      </main>
      <footer className="mt-8 text-sm text-gray-500">
        &copy; 2025 QuikBroker. All rights reserved.
      </footer>
    </div>
  );
}
