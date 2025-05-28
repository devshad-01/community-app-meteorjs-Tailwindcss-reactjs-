// Home page component
import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const HomePage = () => (
    <MainLayout>
        {/* Hero Section */}
        <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Welcome Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Hello, Friend 👋
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 text-pretty">
                        Welcome to your clean, minimal application. Simple dark and light themes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                            Get Started
                        </button>
                        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 border border-gray-300 dark:border-gray-600">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Theme Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gray-900 dark:bg-white p-6 rounded-xl text-white dark:text-gray-900 shadow-lg animate-slide-up">
                        <h3 className="text-lg font-semibold mb-2">Dark Theme</h3>
                        <p className="text-gray-300 dark:text-gray-600">Clean and modern</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-up" style={{animationDelay: '0.1s'}}>
                        <h3 className="text-lg font-semibold mb-2">Light Theme</h3>
                        <p className="text-gray-600 dark:text-gray-300">Bright and clear</p>
                    </div>
                </div>

                {/* Color Palette Demo */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Color Palette</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Light Theme Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Light Theme</h3>
                            <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <div className="text-sm font-medium text-gray-900">White Background</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700">Gray 50</div>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700">Gray 100</div>
                                </div>
                                <div className="bg-gray-200 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700">Gray 200</div>
                                </div>
                                <div className="bg-gray-300 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-gray-800">Gray 300</div>
                                </div>
                            </div>
                        </div>

                        {/* Dark Theme Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Dark Theme</h3>
                            <div className="space-y-2">
                                <div className="bg-gray-900 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-white">Gray 900</div>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-white">Gray 800</div>
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-white">Gray 700</div>
                                </div>
                                <div className="bg-gray-600 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-white">Gray 600</div>
                                </div>
                                <div className="bg-gray-500 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-white">Gray 500</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contrast Examples */}
                    <div className="mt-6 space-y-3">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Contrast Examples</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black p-4 rounded-lg">
                                <div className="text-sm font-medium text-white">Black on White (Inverse)</div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Adaptive Background</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
);
