# Raising Atlantic — Mobile App

React Native (Expo) mobile application for the Raising Atlantic platform.

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18+ | |
| npm | 9+ | Used with `--legacy-peer-deps` |
| Expo CLI | Latest | `npm install -g expo-cli` or use `npx expo` |
| **iOS** | macOS only | Xcode 15+ with iOS Simulator |
| **Android** | macOS/Windows/Linux | Android Studio + Android Emulator |
| **Physical device** | iOS or Android | Install [Expo Go](https://expo.dev/go) app |

---

## Installation

From the repo root (recommended):
```bash
moon run mobile:install
```

Or directly inside this directory:
```bash
cd src/apps/mobile
npm install --legacy-peer-deps
```

---

## Running the App

### Option 1 — Interactive Metro server (recommended for development)

Start the Metro bundler and Expo dev server:

```bash
# Via Moonrepo (from repo root)
moon run mobile:dev

# Or directly
cd src/apps/mobile
npm run dev
```

The terminal will display an interactive menu. From there:

| Key | Action |
|-----|--------|
| `i` | Open iOS Simulator |
| `a` | Open Android Emulator |
| `w` | Open in web browser |
| `r` | Reload the app |
| `m` | Toggle menu |
| Scan QR | Open in Expo Go on a physical device |

### Option 2 — Launch directly for a specific platform

These commands start the Metro server **and** open the target platform in one step:

```bash
# iOS Simulator (macOS only)
moon run mobile:ios
# or: cd src/apps/mobile && npm run ios

# Android Emulator
moon run mobile:android
# or: cd src/apps/mobile && npm run android
```

> **iOS requirement:** Xcode must be installed and the iOS Simulator must be available. Run `xcode-select --install` if prompted.

> **Android requirement:** Android Studio must be installed, an AVD (Android Virtual Device) created, and `ANDROID_HOME` set in your shell environment.

### Option 3 — Physical device via Expo Go

1. Install **Expo Go** on your device ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).
2. Start the dev server: `npm run dev`
3. Scan the QR code shown in the terminal with your device's camera (iOS) or directly in Expo Go (Android).

---

## Stopping the Server

Press `Ctrl + C` in the terminal running the Metro server.

---

## Project Structure

```
src/apps/mobile/
├── App.tsx              # Root application component
├── index.ts             # Entry point — registers App with Expo
├── app.json             # Expo project configuration
├── babel.config.js      # Babel + NativeWind JSX transform
├── metro.config.js      # Metro bundler + NativeWind integration
├── tailwind.config.js   # Tailwind CSS configuration
├── global.css           # Tailwind directives (@base, @components, @utilities)
├── nativewind-env.d.ts  # Auto-generated NativeWind type definitions
├── tsconfig.json        # TypeScript configuration (strict mode)
└── assets/              # App icons and splash screen images
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `expo start` | Start Metro server (interactive) |
| `ios` | `expo start --ios` | Start Metro + open iOS Simulator |
| `android` | `expo start --android` | Start Metro + open Android Emulator |
| `web` | `expo start --web` | Start Metro + open in browser |

---

## Moon Tasks (from repo root)

| Task | Command | Description |
|------|---------|-------------|
| `moon run mobile:install` | `npm install --legacy-peer-deps` | Install dependencies |
| `moon run mobile:dev` | `expo start` | Start dev server (interactive) |
| `moon run mobile:ios` | `expo start --ios` | Run on iOS Simulator |
| `moon run mobile:android` | `expo start --android` | Run on Android Emulator |
| `moon run mobile:build` | `npx expo export` | Export app for distribution |
| `moon run mobile:lint` | `tsc --noEmit` | TypeScript type check |
| `moon run mobile:clean` | Remove cache + node_modules | Clean build artifacts |

---

## Styling

This app uses **NativeWind v4** — Tailwind CSS for React Native.

- Write Tailwind classes directly in `className` props on React Native components.
- Global styles are in [global.css](./global.css).
- Tailwind config: [tailwind.config.js](./tailwind.config.js).

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Hello</Text>
    </View>
  );
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 via Expo 54 |
| Language | TypeScript 5.9 (strict) |
| Styling | NativeWind 4 (Tailwind CSS) |
| Bundler | Metro |
| Architecture | React Native New Architecture (enabled) |

---

## Troubleshooting

**Metro bundler port conflict:**
```bash
npx expo start --port 8082
```

**iOS Simulator not found:**
```bash
# Install Xcode command line tools
xcode-select --install
# Open Simulator manually
open -a Simulator
```

**Android emulator not detected:**
- Ensure `ANDROID_HOME` is set: `export ANDROID_HOME=$HOME/Library/Android/sdk`
- Add to PATH: `export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools`
- Start an AVD from Android Studio → Device Manager before running `npm run android`

**Clear Expo cache:**
```bash
npx expo start --clear
# or
moon run mobile:clean && moon run mobile:install
```

**Dependency install errors:**
```bash
cd src/apps/mobile
npm install --legacy-peer-deps
```
The `--legacy-peer-deps` flag is required due to React 19 peer dependency constraints in some Expo packages.
