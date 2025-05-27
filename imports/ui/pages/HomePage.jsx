// Home page component
import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const HomePage = () => (
  <MainLayout>
    <div className="home-page">
      <h1>Hello World</h1>
      <p>Welcome to the Community App!</p>
    </div>
  </MainLayout>
);
