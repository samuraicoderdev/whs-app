# Smart SGA & Picking - Industrial Warehouse Management System

A modern, mobile-first Warehouse Management System (WMS) designed for industrial logistics operations. This application streamlines inventory management, order picking, and customer relationship management with full support for mobile devices and barcode scanning capabilities.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Mobile & PWA Support](#mobile--pwa-support)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Modules
- **Dashboard**: Real-time KPIs and operational metrics overview
- **Inventory Management**: Complete stock tracking with real-time updates
- **Picking System**: Advanced order fulfillment with multiple strategies:
  - Single Order Picking
  - Batch Picking
  - Zone Picking
  - Wave Picking
- **CRM Module**: Customer database with status tracking and interaction history

### Mobile Capabilities
- 📱 **Responsive Design**: Optimized for smartphones, tablets, and desktops
- 📷 **Barcode Scanner**: Native camera integration for scanning barcodes and QR codes
- 🔄 **Real-time Sync**: Instant data synchronization across all devices
- 📲 **PWA Support**: Install as a Progressive Web App for offline capabilities

### Key Features
- Real-time inventory tracking
- Multi-strategy picking workflows
- Customer relationship management
- Interactive dashboard with analytics
- Mobile-optimized interface
- Barcode/QR code scanning
- Offline-first architecture
- Fast and responsive UI with animations

## Technology Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite 6** - Next-generation build tool for fast development
- **Tailwind CSS v4** - Utility-first CSS framework with native Vite plugin
- **TypeScript** - Type-safe development
- **Lucide React** - Beautiful icon library
- **Motion** - Smooth animations and transitions (formerly Framer Motion)
- **HTML5-QRCode** - Camera-based barcode scanning

### Backend
- **Bun Runtime** - Fast JavaScript runtime
- **Prisma ORM** - Type-safe database access
- **SQLite** - Lightweight database (development)
- **RESTful API** - Clean API architecture

## Mobile & PWA Support

This application is built as a Progressive Web App (PWA) with the following capabilities:

- **Installable**: Add to home screen on iOS and Android devices
- **Offline Mode**: Core functionality available without internet connection
- **Camera Access**: Direct access to device camera for barcode scanning
- **Touch Optimized**: Large touch targets and gesture support
- **Responsive Layout**: Adapts to any screen size from mobile to desktop

### PWA Implementation Details
See `frontend/PWA-IMPLEMENTATION-SUMMARY.md` for complete PWA configuration guide.

## Installation

### Prerequisites
- Node.js 18+ or Bun 1.0+
- npm or bun package manager

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev