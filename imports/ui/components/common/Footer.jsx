import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";

export const Footer = ({ onNav }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "features" },
      { name: "Events", href: "events" },
      { name: "Forums", href: "forums" },
      { name: "Chat", href: "chat" },
      { name: "Pricing", href: "pricing" },
    ],
    company: [
      { name: "About Us", href: "about" },
      { name: "Careers", href: "careers" },
      { name: "Blog", href: "blog" },
      { name: "Press", href: "press" },
      { name: "Contact", href: "contact" },
    ],
    support: [
      { name: "Help Center", href: "help" },
      { name: "Documentation", href: "docs" },
      { name: "API Reference", href: "api" },
      { name: "Community", href: "community" },
      { name: "Status", href: "status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "privacy" },
      { name: "Terms of Service", href: "terms" },
      { name: "Cookie Policy", href: "cookies" },
      { name: "GDPR", href: "gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  ];

  // Helper to render a list of links but as spans with onClick
  const renderNavLinks = (links) =>
    links.map((link) => (
      <li key={link.name}>
        <span
          role="button"
          tabIndex={0}
          className="text-slate-300 hover:text-orange-400 transition-colors text-sm cursor-pointer select-none"
          onClick={() => onNav && onNav(link.href)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onNav && onNav(link.href);
            }
          }}
        >
          {link.name}
        </span>
      </li>
    ));

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CH</span>
              </div>
              <span className="font-bold text-xl">CommunityHub</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Connect, collaborate, and build amazing communities with our modern platform featuring real-time chat,
              events, forums, and more.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@communityhub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">{renderNavLinks(footerLinks.product)}</ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">{renderNavLinks(footerLinks.company)}</ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">{renderNavLinks(footerLinks.support)}</ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">{renderNavLinks(footerLinks.legal)}</ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">Stay updated</h3>
            <p className="text-slate-300 text-sm mb-4">Get the latest news and updates from CommunityHub.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <span>© {currentYear} CommunityHub. All rights reserved.</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>for communities</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-orange-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
