# PPVC Barangay Management System

A comprehensive web-based management system for barangay administration, built with React.js frontend and Node.js/Express backend.

## Overview

This system provides digital tools for managing barangay operations including:
- Resident registration and management
- Barangay official administration
- Complaint tracking and resolution
- News and announcements
- User authentication and role-based access control

## Tech Stack

**Frontend (Client):**
- React 17 with TypeScript
- Material-UI components
- Redux for state management
- Socket.io for real-time features
- Formik & React Hook Form for form handling

**Backend (Server):**
- Node.js with Express
- TypeScript
- MySQL database with Sequelize ORM
- JWT authentication
- Socket.io for real-time communication
- PDF generation capabilities

## Quick Start

**Development:**
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install

# Start development servers
npm run dev-client    # Start React frontend
npm run dev           # Start Node.js backend
```

**Production:**
```bash
npm start             # Start production server
```
