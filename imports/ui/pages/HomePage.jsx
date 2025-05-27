// Home page component
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMessageSquare, FiUsers, FiArrowRight } from 'react-icons/fi';

export const HomePage = () => (
  <>
    {/* Hero Section */}
    <section className="relative overflow-hidden">
      <div className="bg-hero-radial absolute inset-0"></div>
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Connect with your <span className="text-primary">community</span>
          </h1>
          <p className="text-xl text-muted mb-10 leading-relaxed">
            A comprehensive platform for faith communities to engage with each other through events, forums, and real-time chat.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
              Join Now
            </Link>
            <Link to="/about" className="btn btn-outline px-8 py-3 text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-16 bg-dark bg-opacity-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-16">Community <span className="text-primary">Features</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card feature-card-highlight relative">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
                <FiCalendar className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-medium">Community Events</h3>
            </div>
            <p className="text-muted mb-5">Create, join, and manage community events with RSVPs and calendar integration.</p>
            <Link to="/events" className="flex items-center text-primary hover:underline mt-auto">
              Explore Events <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          {/* Feature 2 */}
          <div className="card feature-card-highlight relative">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
                <FiMessageSquare className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-medium">Discussion Forums</h3>
            </div>
            <p className="text-muted mb-5">Engage in structured discussions with categories, threads, and comprehensive moderation.</p>
            <Link to="/forum" className="flex items-center text-primary hover:underline mt-auto">
              Browse Forums <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          {/* Feature 3 */}
          <div className="card feature-card-highlight relative">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
                <FiUsers className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-medium">Real-Time Chat</h3>
            </div>
            <p className="text-muted mb-5">Connect directly through private conversations and thread-based messaging.</p>
            <Link to="/messages" className="flex items-center text-primary hover:underline mt-auto">
              Start Messaging <FiArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 relative">
      <div className="bg-cta-radial absolute inset-0"></div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center cyber-border p-10">
          <h2 className="text-3xl font-semibold mb-4">Ready to join our community?</h2>
          <p className="text-muted text-lg mb-8">
            Sign up today and connect with like-minded individuals in your community.
          </p>
          <Link to="/register" className="btn btn-primary px-8 py-3 text-lg relative overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 w-1/4 bg-white bg-opacity-20 skew-x-15 animate-button-shine"></span>
          </Link>
        </div>
      </div>
    </section>
  </>
);
