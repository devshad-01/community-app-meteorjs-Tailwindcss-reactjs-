import React, { useState } from 'react';
import { NavigationBar } from './components/common/NavigationBar';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { ForumPage } from './pages/ForumPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/admin/AdminPage';
import { Footer } from './components/common/Footer';

// Additional content components (make sure these are imported or defined somewhere)
const Features = () => <div>Features Content</div>;
const Events = () => <div>Events Content</div>;
const Forums = () => <div>Forums Content</div>;
const Chat = () => <div>Chat Content</div>;
const Pricing = () => <div>Pricing Content</div>;

const About = () => <div>About Us Content</div>;
const Careers = () => <div>Careers Content</div>;
const Blog = () => <div>Blog Content</div>;
const Press = () => <div>Press Content</div>;
const Contact = () => <div>Contact Content</div>;

const Help = () => <div>Help Center Content</div>;
const Docs = () => <div>Documentation Content</div>;
const API = () => <div>API Reference Content</div>;
const Community = () => <div>Community Content</div>;
const Status = () => <div>Status Content</div>;

const Privacy = () => <div>Privacy Policy Content</div>;
const Terms = () => <div>Terms of Service Content</div>;
const Cookies = () => <div>Cookie Policy Content</div>;
const GDPR = () => <div>GDPR Content</div>;

const Home = () => <div>Welcome to CommunityHub!</div>;

export const App = () => {
  // use one state to manage current page
  const [currentPage, setCurrentPage] = useState('home');

  // render page based on currentPage state
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'events':
        return <EventsPage />;
      case 'forum':
        return <ForumPage />;
      case 'chat':
        return <ChatPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;

      // Extra pages from your second list
      case 'features':
        return <Features />;
      case 'forums':
        return <Forums />;
      case 'pricing':
        return <Pricing />;
      case 'about':
        return <About />;
      case 'careers':
        return <Careers />;
      case 'blog':
        return <Blog />;
      case 'press':
        return <Press />;
      case 'contact':
        return <Contact />;
      case 'help':
        return <Help />;
      case 'docs':
        return <Docs />;
      case 'api':
        return <API />;
      case 'community':
        return <Community />;
      case 'status':
        return <Status />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      case 'cookies':
        return <Cookies />;
      case 'gdpr':
        return <GDPR />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <NavigationBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto p-0">
        {renderContent()}
      </main>
      <Footer onNav={(pageName) => setCurrentPage(pageName)} />
    </div>
  );
};
