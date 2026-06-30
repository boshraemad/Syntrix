import { useRouteError, Link } from "react-router-dom";

export default function RootErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4">
      <h1 className="text-6xl font-bold mb-4 text-cyan-400">Oops!</h1>
      <p className="text-xl mb-2">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-400 italic mb-8">
        {error.statusText || error.message}
      </p>

      <Link
        to="/"
        className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white px-6 py-2 rounded-lg transition-all font-bold"
      >
        Go Back Home
      </Link>
    </div>
  );
}