export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <header className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to QuikBroker</h1>
        <p className="text-lg">Streamlining logistics and trucking for brokers and carriers.</p>
      </header>
      <main className="flex flex-col items-center gap-4">
        <p className="text-center">Your one-stop solution for managing logistics efficiently.</p>
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </a>
      </main>
      <footer className="mt-8 text-sm text-gray-500">
        &copy; 2025 QuikBroker. All rights reserved.
      </footer>
    </div>
  );
}
