# Banky mobile

An independent React Native + Expo frontend using TypeScript. The desktop app
lives in `../frontend`; both frontends can use the Python API in `../backend`.
This starter displays a welcome screen. Banking screens, navigation, authentication,
and API integration are not implemented yet.

## Run on your iPhone

From the repository root:

```bash
cd mobile
npm install
npx expo login
npm start
```

Install Expo Go from the iPhone App Store and sign in with the same Expo account
as the CLI. Connect your Mac and iPhone to the same Wi-Fi network, then scan the
terminal QR code using the iPhone Camera app and open it in Expo Go. Allow local
network access if iOS asks. Changes to your components appear through Fast Refresh.

Expo Go is a development preview, not a standalone installed Banky app. A signed
iOS build is a later step when you're ready to distribute the app.

For the iOS simulator, install Xcode and an iOS simulator runtime, then run
`npm run ios` from this directory.

## Where to write code

```text
mobile/
  App.tsx                     # Root component
  src/screens/HomeScreen.tsx   # First mobile screen; start editing here
  assets/                     # Images and app icons
  app.json                    # Expo app configuration
  package.json                # Mobile-only dependencies and commands
```

Add more screens under `src/screens/` and reusable native components under
`src/components/` as needed. This uses Expo's blank TypeScript template; it does
not include a navigation library yet.

Use React Native's `View`, `Text`, and `Pressable` to build the UI. NativeWind 4
and Tailwind CSS 3 are configured, so style components with `className`:

```tsx
<Text className="text-2xl font-bold text-green-700">Banky</Text>
```

Edit `src/screens/HomeScreen.tsx` to try classes. `tailwind.config.js` scans
`App.tsx` and files under `src/`. Write complete class names (for example,
`active ? 'text-green-700' : 'text-gray-500'`) instead of constructing them
with string interpolation. React Native's `style` prop also remains available.

`global.css` contains the Tailwind directives and is imported by `App.tsx`.
The Babel and Metro configs enable NativeWind, and `nativewind-env.d.ts`
adds TypeScript support for `className`. After changing this configuration,
stop the dev server and restart it with `npm run ios -- --clear`.

React hooks and TypeScript work as usual; use native components instead of
HTML elements. The desktop app's Tauri APIs do not belong in this frontend.

## Connecting the existing backend later

The welcome screen does not make API requests. When adding them:

1. Copy `.env.example` to `.env.local` in this directory and replace the example
   address with your Mac's Wi-Fi IP address (System Settings → Wi-Fi → Details).
   `localhost` on a physical iPhone refers to the phone, not your Mac.
2. Start the existing backend on your local network, in a separate terminal from
   the repository root:

   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   This assumes the existing backend virtual environment is already set up.
   Use a trusted local network; don't expose the development server publicly.
3. Read the URL in your mobile code as `process.env.EXPO_PUBLIC_API_URL`.
   Reload the app after changing the environment file. Only public configuration
   belongs in `EXPO_PUBLIC_` variables; keep bank credentials and private keys in
   the backend. For use away from your Mac, configure an authenticated HTTPS API.

## Checks

```bash
npm run typecheck
npm run lint
npx expo export --platform ios
```

The export verifies JavaScript bundling; it is not a signed iOS app build.

## References

- [Create an Expo project](https://docs.expo.dev/get-started/create-a-project/)
- [Run on a device](https://docs.expo.dev/get-started/start-developing/)
- [Expo environment variables](https://docs.expo.dev/guides/environment-variables/)
