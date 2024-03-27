import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div id="error-page">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-primary-600 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">404</h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">Something's missing.</p>
          <Link
            to="/"
            className="my-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-center text-sm font-bold text-black focus:outline-none">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
