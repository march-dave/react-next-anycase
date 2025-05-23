# Titanium Cutting Board Site

A simple Next.js website showcasing a titanium cutting board. Styled with Tailwind CSS.

## Development

Install dependencies (requires Node.js) and run the development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Android App

An Expo-based React Native project lives in `android-app` for Android only.
Install dependencies and run on a device or emulator:

```bash
cd android-app
npm install
npm run android
```

`npm run build` generates a production AAB using EAS.

The Android project integrates AdMob ads via `react-native-google-mobile-ads` and
includes a simple PDF viewer component powered by `react-native-pdf`.

## Mosaic Puzzle Game

Another React Native project using version 0.74 lives in `mosaic-puzzle-game`.
Run it on Android with the same commands:

```bash
cd mosaic-puzzle-game
npm install
npm run android
```

This app displays all text in English and integrates Google Mobile Ads
(`react-native-google-mobile-ads` @14.7.2).

## Reflex Rush App

A reaction time game using React Native 0.78 in `ReflexRushApp`. Run on Android with:

```bash
cd ReflexRushApp
npm install
npm run android
```

Google Mobile Ads (`react-native-google-mobile-ads` @15.2.0) is integrated and all user text is in English.
