# PubCam Student Guide

A comprehensive mobile application built with Expo and React Native to help students navigate through public service examinations, scholarships, and guides.

## 🚀 Features

- Public Service Examination Guide
- Scholarship Information
- Student Resources
- Modern UI with Material Design
- Offline Support
- Cross-platform (iOS & Android)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Bun](https://bun.sh/) (Package manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Nchindiapierretteajua/B-tech-educ
cd B-tech-educ
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun start
```

## 📱 Running the App

### iOS

```bash
bun ios
```

### Android

```bash
bun android
```

### Web

```bash
bun web
```

## 📱 Running with Expo Go

### Android Setup with Expo Go

1. Install Expo Go from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:

```bash
bun start
```

3. You'll see a QR code in your terminal. You have two options to connect:

   - Scan the QR code using the Expo Go app
   - Press 'a' in the terminal to open on an Android emulator

4. If you're running on a physical device:

   - Make sure your phone and computer are on the same WiFi network
   - Open Expo Go and tap "Scan QR Code"
   - Scan the QR code shown in your terminal

5. Troubleshooting:
   - If the QR code doesn't work, you can manually enter the URL shown in the terminal
   - If you get a connection error, check that:
     - Your phone and computer are on the same network
     - Your computer's firewall isn't blocking the connection
     - The development server is running properly

## 🏗️ Project Structure

```
pubcam-stud/
├── app/                 # Main application screens and navigation
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable UI components
├── data/              # Data files and constants
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and helpers
├── store/             # Redux store configuration
├── theme/             # Theme configuration and styles
└── types/             # TypeScript type definitions
```

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage
- **Styling**: Native styling with TypeScript

## 📦 Key Dependencies

- expo: ^53.0.0
- react-native: 0.79.1
- @reduxjs/toolkit: ^2.0.1
- react-hook-form: ^7.49.3
- zod: ^3.22.4
- expo-router: ~5.0.2
- react-native-paper: ^5.12.3

## 🔧 Development Scripts

- `bun start` - Start the Expo development server
- `bun android` - Run on Android
- `bun ios` - Run on iOS
- `bun web` - Run on web
- `bun lint` - Run linting
- `bun reset-project` - Reset project cache and dependencies

## 📱 Supported Platforms

- iOS
- Android
- Web (with limited functionality)
