# @umer/use-force-update

A React Native hook for checking and prompting app updates. **Backend-agnostic** — works with any API.

## Features

- ✅ Check for required (force) and optional updates
- ✅ Automatic checks on app foreground
- ✅ Works with any backend API
- ✅ TypeScript support
- ✅ Easy integration with Sentry, toast notifications, etc.

## Installation

```bash
npm install @umer/use-force-update
# or
yarn add @umer/use-force-update
```

## Usage

### Basic Example

```typescript
import { useForceUpdate } from '@umer/use-force-update';
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
const { shouldForceUpdate, isLoading, error, openAppStore, manualCheck } = useForceUpdate({
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

// Manually trigger check
<Button title="Check for Updates" onPress={manualCheck} />
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

## License

MIT
