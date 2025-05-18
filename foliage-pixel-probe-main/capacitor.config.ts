
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.95cb3944244248e58ad7b8577cbfebcb',
  appName: 'foliage-pixel-probe',
  webDir: 'dist',
  server: {
    url: 'https://95cb3944-2442-48e5-8ad7-b8577cbfebcb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      androidDatabaseLocation: 'databases'
    }
  }
};

export default config;
