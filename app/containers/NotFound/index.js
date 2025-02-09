import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white w-full">
      <div className="text-center">
        <div className="inline-flex rounded-full">
          <div className="rounded-full">
            <img
              src="/images/notFound.gif"
              className="max-w-[300px] md:max-w-[500px]"
              alt="not-found"
            />
          </div>
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-slate-800 lg:text-[50px]">
          404 - Page not found
        </h1>
        <p className="text-slate-600 lg:text-lg my-5">
          The page you are looking for doesn&apos;t exist or <br />
          has been removed.
        </p>
        <Link
          to="/"
          className="btn btn-black bg-secondary-100 text-white py-2 h-[42px] inline-block text-18 md:text-20"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
