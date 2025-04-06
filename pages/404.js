// pages/404.js

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Head>
        <title>Page Not Found</title>
      </Head>
      
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6 text-gray-600">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}