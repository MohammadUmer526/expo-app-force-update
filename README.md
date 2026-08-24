# expo-app-force-update

A React Native hook for checking and prompting app updates. **Backend-agnostic** — works with any API.

## Features

- ✅ Check for required (force) and optional updates
- ✅ Automatic checks on app foreground
- ✅ Works with any backend API
- ✅ TypeScript support
- ✅ Easy integration with Sentry, toast notifications, etc.
- ✅ Zero dependencies
- ✅ Lightweight (~14 KB)

## Installation

```bash
npm install expo-app-force-update
# or
yarn add expo-app-force-update
```

## Usage

### Basic Example

```typescript
import { useForceUpdate } from 'expo-app-force-update';
import Constants from 'expo-constants';

export function AppUpdateChecker() {
  const { shouldForceUpdate, openAppStore } = useForceUpdate({
    fetchVersionData: async () => {
      const response = await fetch('https://your-api.com/version');
      return response.json();
    },
    currentVersion: Constants.expoConfig?.version || '',
    onForceUpdateDetected: (data) => {
      console.log('Force update required:', data);
    },
  });

  if (shouldForceUpdate) {
    return (
      <View>
        <Text>A new version is required</Text>
        <Button title="Update" onPress={openAppStore} />
      </View>
    );
  }

  return null;
}
```

### With Callbacks & Error Handling

```typescript
import { useForceUpdate } from 'expo-app-force-update';
import Constants from 'expo-constants';

export function AppUpdateChecker() {
  const {
    shouldForceUpdate,
    isLoading,
    error,
    openAppStore,
    manualCheck
  } = useForceUpdate({
    fetchVersionData: async () => {
      // Your API call here
      const res = await fetch('https://api.example.com/app-version');
      return res.json();
    },
    currentVersion: Constants.expoConfig?.version || '',
    onForceUpdateDetected: (data) => {
      // Show modal or navigate to update screen
      customToast.error('Update Required', 'Please update to continue');
    },
    onOptionalUpdateAvailable: (data) => {
      // Show optional update prompt
      customToast.info('Update Available', 'A new version is available');
    },
    onError: (error) => {
      console.error('Version check failed:', error);
      Sentry.captureException(error);
    },
    checkOnAppForeground: true, // Default: true
  });

  return (
    <View>
      {error && <Text>Error: {error.message}</Text>}
      {isLoading && <Text>Checking for updates...</Text>}
      <Button title="Check for Updates" onPress={manualCheck} />
    </View>
  );
}
```

## API Response Format

Your API should return this format:

```typescript
{
  versionNumber: "2.0.0",
  isForceUpdate: true,
  id?: 1,
  createdAt?: "2024-01-01T00:00:00Z",
  updatedAt?: "2024-01-01T00:00:00Z"
}
```

## Configuration

| Option                      | Type                                  | Default  | Description                                      |
| --------------------------- | ------------------------------------- | -------- | ------------------------------------------------ |
| `fetchVersionData`          | `() => Promise<VersionCheckResponse>` | Required | Function that fetches version data from your API |
| `currentVersion`            | `string`                              | Required | Current app version                              |
| `onForceUpdateDetected`     | `(data) => void`                      | Optional | Callback when force update is required           |
| `onOptionalUpdateAvailable` | `(data) => void`                      | Optional | Callback when optional update is available       |
| `onError`                   | `(error) => void`                     | Optional | Callback on error                                |
| `checkOnAppForeground`      | `boolean`                             | `true`   | Auto-check when app comes to foreground          |

## Return Values

| Property            | Type                  | Description                    |
| ------------------- | --------------------- | ------------------------------ |
| `shouldForceUpdate` | `boolean`             | Whether update is required     |
| `isLoading`         | `boolean`             | Currently checking for updates |
| `error`             | `Error \| null`       | Last error, if any             |
| `openAppStore`      | `() => Promise<void>` | Open app store (native or web) |
| `manualCheck`       | `() => Promise<void>` | Manually trigger version check |

## Examples

### Firebase Example

```typescript
import { useForceUpdate } from "expo-app-force-update";
import Constants from "expo-constants";

export function FirebaseUpdateChecker() {
  return useForceUpdate({
    fetchVersionData: async () => {
      const doc = await firebase
        .firestore()
        .collection("app-versions")
        .doc("current")
        .get();
      return doc.data() as VersionCheckResponse;
    },
    currentVersion: Constants.expoConfig?.version || "",
  });
}
```

### Custom API Example

```typescript
import { useForceUpdate } from "expo-app-force-update";
import Constants from "expo-constants";

export function CustomAPIUpdateChecker() {
  return useForceUpdate({
    fetchVersionData: async () => {
      const res = await fetch("https://your-backend.com/api/app-version", {
        headers: {
          Authorization: `Bearer ${YOUR_API_KEY}`,
        },
      });
      return res.json();
    },
    currentVersion: Constants.expoConfig?.version || "",
  });
}
```

### Strapi Example

```typescript
import { useForceUpdate } from "expo-app-force-update";
import Constants from "expo-constants";

export function StrapiUpdateChecker() {
  return useForceUpdate({
    fetchVersionData: async () => {
      const res = await fetch(
        "https://your-strapi.com/api/app-versions?sort=updatedAt:desc&pagination[limit]=1",
      );
      const data = await res.json();
      const entry = data.data[0]?.attributes;
      return {
        versionNumber: entry.versionNumber,
        isForceUpdate: entry.isForceUpdate,
      };
    },
    currentVersion: Constants.expoConfig?.version || "",
  });
}
```

## TypeScript Support

Full TypeScript types are included:

```typescript
import type {
  UseForceUpdateConfig,
  UseForceUpdateReturn,
  VersionCheckResponse,
} from "expo-app-force-update";
```

## Version Comparison Logic

The package uses semantic versioning for comparison. It checks if the remote version differs from the current version **and** if `isForceUpdate` is true.

```typescript
// Example: Current app is 1.0.0
// API returns: { versionNumber: "1.0.1", isForceUpdate: true }
// Result: shouldForceUpdate = true ✓

// Example: Current app is 1.0.0
// API returns: { versionNumber: "1.0.1", isForceUpdate: false }
// Result: shouldForceUpdate = false (but onOptionalUpdateAvailable is called)
```

## Peer Dependencies

This package requires:

- `react` ^16.0.0 || ^17.0.0 || ^18.0.0
- `react-native` ^0.60.0 || ^0.70.0 || ^0.71.0
- `expo-constants` ^13.0.0 || ^14.0.0

## License

MIT

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Support

- 📦 [npm package](https://www.npmjs.com/package/expo-app-force-update)
- 🐙 [GitHub repository](https://github.com/MohammadUmer526/expo-app-force-update)
- 📝 [Report issues](https://github.com/MohammadUmer526/expo-app-force-update/issues)

## Author

**Muhammad Umer** - [@MohammadUmer526](https://github.com/MohammadUmer526)
