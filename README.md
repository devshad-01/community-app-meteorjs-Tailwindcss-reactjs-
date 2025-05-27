# Community App

A comprehensive Meteor-based platform for faith communities to engage with each other through events, forums, and real-time chat.

## Features

- **User Management**: Authentication, profiles, and role-based permissions
- **Events System**: Create, join, and manage community events with RSVPs
- **Forum System**: Structured categories, subforums, threads, and moderation
- **Real-time Chat**: Private conversations and thread-based messaging
- **Notifications**: Activity alerts and engagement notifications
- **Admin Dashboard**: Comprehensive administration and moderation tools

## Technology Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Meteor.js with MongoDB
- **Real-time**: DDP (Distributed Data Protocol)
- **Authentication**: Meteor Accounts system with roles
- **UI Components**: React Hook Form, React Icons, FullCalendar
- **CSS**: Tailwind CSS with PostCSS processing

## Project Structure

The project follows a modular structure with clear separation between API and UI layers:

```
/imports                 # Application code
  /api                   # Data layer: collections, methods, and publications
    /users               # User management with authentication and roles
    /events              # Event management with RSVP functionality
    /forums              # Structured forum system with categories, subforums, threads, posts
    /messages            # Real-time chat messages system
    /notifications       # User notifications system
    /threads             # Private messaging threads
  /startup               # Startup code for client and server
    /client              # Client initialization code
    /server              # Server initialization and fixture data
  /ui                    # UI layer
    /components          # Reusable UI components
      /admin             # Admin-specific components
      /user              # User profile components
      /events            # Event-related components (CreateEventForm, etc.)
      /forum             # Forum components
      /chat              # Chat components
      /common            # Shared components (Header, Footer, Sidebar)
    /layouts             # Layout components (MainLayout)
    /pages               # Page components for routing
      /admin             # Admin dashboard pages (Dashboard, Users, Events, Forums)
    /helpers             # UI helper functions
  /modules               # Feature modules and business logic
  /styles                # Styling
  /utils                 # Utility functions
/client                  # Client entry point
/server                  # Server entry point
/public                  # Public assets (images, fonts)
/private                 # Private assets (email templates)
/tests                   # Test files
    /messages      # Chat messages
    /threads       # Conversation threads
    /users         # User management
    /notifications # Notification system
  /ui              # React components and pages
    /components    # Reusable UI components
    /layouts       # Layout templates
    /pages         # Application pages
  /startup         # Initialization code
  /styles          # Global styles and Tailwind config
  /utils           # Utility functions and helpers
```

## Setup Instructions

1. Clone the repository
2. Install Meteor if not already installed:
   ```
   npm install -g meteor
   ```
3. Install dependencies:
   ```
   meteor npm install
   ```
4. Run the application:
   ```
   meteor run
   ```

## Development Commands

```bash
# User Authentication
meteor add accounts-password accounts-ui alanning:roles

# Real-time Presence
meteor add konecty:user-presence

# Database Schema
meteor add aldeed:collection2

# UI Dependencies
meteor npm install --save tailwindcss postcss autoprefixer @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid moment simpl-schema react-hook-form react-icons
```

## Deployment

The app can be deployed to Meteor Galaxy or bundled as a Node.js application for deployment to other platforms.

```bash
# Deploy to Meteor Galaxy
meteor deploy your-app-name.meteorapp.com --settings settings.json

# Bundle for other platforms
meteor build /path/to/output --architecture os.linux.x86_64
```

## Contributors

Built by the community for the community. Contributions welcome!

## License

MIT
