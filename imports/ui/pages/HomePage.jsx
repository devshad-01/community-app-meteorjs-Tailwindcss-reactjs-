// Home page component
import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const HomePage = () => (
    <MainLayout>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-primary-500 mb-2">Hello, Friend 👋</h2>
            <p className="text-gray-600">
                This is a static Tailwind CSS component inside a div. If you can see the styling (shadow, padding, colors), Tailwind is working!
            </p>
        </div>

        <div className="mt-10 space-y-2 p-4">
            <div className="bg-primary-100 p-4 rounded">Primary 100</div>
            <div className="bg-primary-300 p-4 rounded text-white">Primary 300</div>
            <div className="bg-primary-500 p-4 rounded text-white">Primary 500</div>
            <div className="bg-primary-700 p-4 rounded text-white">Primary 700</div>
            <div className="bg-primary-900 p-4 rounded text-white">Primary 900</div>
            <div className="bg-primary-500/80 p-4 rounded text-white">Primary 500 / 80% Opacity</div>
        </div>
    </MainLayout>
);
