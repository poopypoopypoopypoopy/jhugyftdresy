
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
export default function NotFound() {
  const err = useRouteError();
  const msg = isRouteErrorResponse(err) ? `${err.status} ${err.statusText}` : "Not found";
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-2xl font-semibold mb-2">Routing error</h1>
      <p className="mb-6 text-sm text-gray-600">{msg}</p>
      <Link className="underline text-sm" to="/">Go home</Link>
    </main>
  );
}
