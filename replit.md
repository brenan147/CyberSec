# Terminal Hacker Simulator

## Overview

This is a full-stack web application that simulates a hacker terminal interface. The project features a dark, matrix-style terminal where users can execute simulated cybersecurity commands like IP tracking, port scanning, and network reconnaissance. The application provides educational simulations of various cybersecurity tools with realistic terminal output and warnings about ethical usage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom terminal-themed color scheme (dark background with green accents)
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Typography**: Fira Code monospace font for authentic terminal appearance

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints under `/api` prefix
- **Request Logging**: Custom middleware for API request/response logging with timing
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Cloud Database**: Neon serverless PostgreSQL for scalable hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Database Schema
- **Users**: Basic user authentication with username/password
- **Terminal Sessions**: Persistent terminal session data with JSON blob storage
- **Commands**: Command history tracking with input/output logging

### Authentication & Sessions
- **Session Management**: Express sessions with PostgreSQL session store
- **User System**: Simple username/password authentication without complex auth flows
- **Session Persistence**: Database-backed sessions for persistence across server restarts

### Terminal Simulation System
- **Command Router**: Predefined command simulations with realistic output
- **Command Categories**: Organized commands (TRACE, SCAN, DDOS, RECON, etc.)
- **Educational Focus**: All simulations include warnings about ethical usage and legal compliance
- **Real-time Output**: Simulated command execution with delayed output for realism

### Development Environment
- **Hot Reload**: Vite HMR for instant frontend updates
- **Development Server**: Express server with Vite middleware integration
- **TypeScript**: Full TypeScript support across frontend, backend, and shared code
- **Path Aliases**: Configured import aliases for clean module resolution

## External Dependencies

### Database Services
- **Neon**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit and query builder
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Radix UI**: Comprehensive set of accessible React primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and enhanced development experience
- **React Hook Form**: Form handling with validation support
- **Zod**: Schema validation for type-safe data handling

### Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Router (Wouter)**: Lightweight routing solution
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Utility for managing component variants