/**
 * Response format from your version check API
 */
export interface VersionCheckResponse {
    versionNumber: string;
    isForceUpdate: boolean;
    id?: number | string;
    createdAt?: string;
    publishedAt?: string;
    updatedAt?: string;
}

/**
 * Configuration options for useForceUpdate hook
 */
export interface UseForceUpdateConfig {
    /**
     * Function that fetches version data from your API
     * Should return VersionCheckResponse
     */
    fetchVersionData: () => Promise<VersionCheckResponse>;

    /**
     * Current app version (e.g., from Constants.expoConfig?.version)
     */
    currentVersion: string;

    /**
     * Optional callback when an update is required (force update)
     */
    onForceUpdateDetected?: (data: VersionCheckResponse) => void;

    /**
     * Optional callback when an optional update is available
     */
    onOptionalUpdateAvailable?: (data: VersionCheckResponse) => void;

    /**
     * Optional callback when update check fails
     */
    onError?: (error: Error) => void;

    /**
     * Check interval in milliseconds (default: check on app foreground only)
     */
    checkIntervalMs?: number;

    /**
     * Whether to automatically check on app foreground (default: true)
     */
    checkOnAppForeground?: boolean;
}

/**
 * Return type of useForceUpdate hook
 */
export interface UseForceUpdateReturn {
    shouldForceUpdate: boolean;
    isLoading: boolean;
    error: Error | null;
    openAppStore: () => Promise<void>;
    manualCheck: () => Promise<void>;
}