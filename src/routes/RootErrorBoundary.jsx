import { useRouteError, Link } from "react-router-dom";

export default function RootErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center text-font p-4">
      <h1 className="text-6xl font-bold mb-4 text-third">Oops!</h1>
      <p className="text-xl mb-2">Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-400 italic mb-8">
        {error.statusText || error.message}
      </p>
      
      <Link 
        to="/" 
        className="bg-third hover:bg-button text-white px-6 py-2 rounded-lg transition-colors font-bold"
      >
        Go Back Home
      </Link>
    </div>
  );
}