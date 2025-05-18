# Foliage Pixel Probe

A mobile application for analyzing and identifying plant foliage using image processing and machine learning techniques.

## Features

- Plant identification through image capture
- Detailed plant information and care instructions
- Offline database support
- Cross-platform compatibility (iOS and Android)

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

### Running on Mobile Devices

For Android:
```bash
npm run capacitor:sync
npm run capacitor:open:android
```

For iOS:
```bash
npm run capacitor:sync
npm run capacitor:open:ios
```

## License

MIT License
