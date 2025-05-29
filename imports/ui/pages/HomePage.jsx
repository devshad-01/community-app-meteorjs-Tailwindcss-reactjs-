import React from 'react';
import { Link } from "react-router-dom"
import {
  Users,
  Calendar,
  MessageCircle,
  Heart,
  Globe,
  Zap,
  Star,
  ArrowRight, 
  UserPlus,
} from "lucide-react"

export const HomePage = () => {
  const features = [
    {
      icon: Users,
      title: "Community Fellowship",
      description:
        "Stay connected with fellow believers through member profiles, prayer requests, and fellowship opportunities.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop&crop=center",
    },
    {
      icon: Calendar,
      title: "Church Events",
      description:
        "Join worship services, Bible studies, community outreach, and special events with easy RSVP management.",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop&crop=center",
    },
    {
      icon: MessageCircle,
      title: "Faith Conversations",
      description:
        "Share in real-time prayer requests, encouragement, and spiritual discussions with your church family.",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop&crop=center",
    },
    {
      icon: Globe,
      title: "Discussion Forums",
      description:
        "Engage in thoughtful biblical discussions, share testimonies, and grow together in faith and understanding.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center",
    },
  ]

  const stats = [
    { number: "150+", label: "Community Members", icon: Users },
    { number: "25+", label: "Monthly Events", icon: Calendar },
    { number: "500+", label: "Forum Discussions", icon: MessageCircle },
    { number: "2+", label: "Years Together", icon: Heart },
  ]

  const testimonials = [
    {
      name: "Pastor Michael",
      role: "Lead Pastor",
      content: "This platform has truly strengthened our community bonds. Members are more connected than ever before.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Sarah Thompson",
      role: "Youth Leader",
      content: "The real-time chat and event planning features make organizing youth activities so much easier!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b9af?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Elder James",
      role: "Church Elder",
      content:
        "It's wonderful to see our community grow closer through technology while maintaining our spiritual focus.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-background to-warm-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 sm:py-16 lg:py-20 xl:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-warm-100 dark:bg-slate-800 rounded-full text-warm-600 dark:text-orange-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Welcome to Our Community
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-warm-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Growing in
                <span className="text-warm-500 dark:text-orange-400 block">Faith & Fellowship</span>
                Together
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-warm-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Connect with fellow believers, participate in community events, engage in meaningful discussions, and
                grow together in our shared journey of faith and fellowship.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-warm-500 dark:bg-orange-500 hover:bg-warm-600 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-warm hover:shadow-warm-lg group text-sm sm:text-base"
                >
                  Join Our Community
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/events"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-warm-500 dark:border-orange-500 text-warm-500 dark:text-orange-400 hover:bg-warm-50 dark:hover:bg-slate-800 font-semibold rounded-lg transition-all duration-200 group text-sm sm:text-base"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">View Upcoming Events</span>
                  <span className="sm:hidden">View Events</span>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-slide-up mt-8 lg:mt-0">
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=400&fit=crop&crop=center"
                  alt="Community worship and fellowship"
                  className="w-full h-48 sm:h-56 lg:h-64 xl:h-80 object-cover rounded-lg"
                />
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-orange-500 dark:bg-orange-500 text-white p-2 sm:p-3 rounded-full shadow-lg">
                  <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 hidden sm:block">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-warm-900 dark:text-white">15 New Members</p>
                    <p className="text-xs text-warm-500 dark:text-slate-400">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-warm-50 dark:bg-slate-800 border-y border-warm-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center animate-fade-in">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-warm-500 dark:bg-orange-500 text-white rounded-lg mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-warm-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-warm-600 dark:text-slate-300 text-xs sm:text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-12 sm:py-16 bg-background dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-warm-900 dark:text-white mb-3 sm:mb-4">
              What's Happening in Our Community
            </h2>
            <p className="text-warm-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Stay updated with the latest news, events, and prayer requests from our church family.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Recent Event */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-warm-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900 dark:text-white text-sm sm:text-base">Upcoming Event</h3>
                  <p className="text-xs sm:text-sm text-warm-500 dark:text-slate-400">This Sunday</p>
                </div>
              </div>
              <p className="text-warm-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                Join us for our monthly community potluck after Sunday service. Bring a dish to share!
              </p>
              <Link
                to="/events"
                className="text-warm-500 dark:text-orange-400 hover:text-warm-600 dark:hover:text-orange-300 font-medium text-xs sm:text-sm"
              >
                View all events →
              </Link>
            </div>

            {/* Prayer Request */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-warm-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900 dark:text-white text-sm sm:text-base">Prayer Requests</h3>
                  <p className="text-xs sm:text-sm text-warm-500 dark:text-slate-400">Community Care</p>
                </div>
              </div>
              <p className="text-warm-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                Please pray for the Johnson family during this difficult time. Your prayers and support mean everything.
              </p>
              <Link
                to="/forum"
                className="text-warm-500 dark:text-orange-400 hover:text-warm-600 dark:hover:text-orange-300 font-medium text-xs sm:text-sm"
              >
                Share prayer requests →
              </Link>
            </div>

            {/* Latest Discussion */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-warm-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900 dark:text-white text-sm sm:text-base">Bible Study</h3>
                  <p className="text-xs sm:text-sm text-warm-500 dark:text-slate-400">Latest Discussion</p>
                </div>
              </div>
              <p className="text-warm-700 dark:text-slate-300 mb-4 text-sm sm:text-base">
                Join the discussion on this week's sermon about faith and perseverance. Share your insights!
              </p>
              <Link
                to="/forum"
                className="text-warm-500 dark:text-orange-400 hover:text-warm-600 dark:hover:text-orange-300 font-medium text-xs sm:text-sm"
              >
                Join discussion →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-warm-900 dark:text-white mb-3 sm:mb-4">
              Everything We Need to Stay Connected
            </h2>
            <p className="text-base sm:text-lg text-warm-600 dark:text-slate-300 max-w-3xl mx-auto">
              From worship services to fellowship events, our platform provides all the tools our community needs to
              grow together in faith and friendship.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group animate-fade-in">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-warm-200 dark:border-slate-700">
                    <div className="relative">
                      <img
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-warm-500 dark:bg-orange-500 text-white p-2 rounded-lg">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-warm-900 dark:text-white mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-warm-600 dark:text-slate-300 mb-3 sm:mb-4 text-sm sm:text-base">
                        {feature.description}
                      </p>
                      <Link
                        to="/forum"
                        className="inline-flex items-center text-warm-500 dark:text-orange-400 hover:text-warm-600 dark:hover:text-orange-300 font-medium group text-sm sm:text-base"
                      >
                        Explore
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-warm-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-warm-900 dark:text-white mb-3 sm:mb-4">
              Voices from Our Community
            </h2>
            <p className="text-base sm:text-lg text-warm-600 dark:text-slate-300 max-w-2xl mx-auto">
              Hear from fellow members about how our community platform has strengthened their faith journey and
              connections with others.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-warm-200 dark:border-slate-700 animate-fade-in"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-warm-700 dark:text-slate-300 mb-4 sm:mb-6 italic text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                  />
                  <div>
                    <div className="font-semibold text-warm-900 dark:text-white text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-warm-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 dark:text-orange-100 mb-6 sm:mb-8">
            Become part of our growing faith community and connect with fellow believers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-warm-600 dark:text-orange-600 hover:bg-warm-50 dark:hover:bg-orange-50 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Join Our Community
            </Link>

            <Link
              to="/events"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-warm-600 dark:hover:text-orange-600 font-semibold rounded-lg transition-all duration-200 group text-sm sm:text-base"
            >
              View Events
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
