// Home page component
import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const HomePage = () => (
  <MainLayout>
    <div className="home-page">
      <h1 className="text-3xl font-bold underline ">
    Hello world!
  </h1>
    </div>

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-blue-200 mb-2">Hello, Friend 👋</h2>
      <p className="text-gray-600">
        This is a static Tailwind CSS component inside a div. If you can see the styling (shadow, padding, colors), Tailwind is working!
      </p>
    </div>
  </MainLayout>
);
