import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { UseForceUpdateConfig, UseForceUpdateReturn } from './types';
import { isUpdateRequired, openAppStore } from './utils';

export const useForceUpdate = (config: UseForceUpdateConfig): UseForceUpdateReturn => {
    const {
        fetchVersionData,
        currentVersion,
        onForceUpdateDetected,
        onOptionalUpdateAvailable,
        onError,
        checkOnAppForeground = true,
    } = config;

    const [shouldForceUpdate, setShouldForceUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Check if app needs updating
     */
    const manualCheck = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const versionData = await fetchVersionData();

            const needsUpdate = isUpdateRequired(
                versionData.versionNumber,
                currentVersion,
                versionData.isForceUpdate
            );

            setShouldForceUpdate(needsUpdate);

            // Trigger callbacks
            if (needsUpdate) {
                onForceUpdateDetected?.(versionData);
            } else if (versionData.versionNumber !== currentVersion) {
                // Update available but not forced
                onOptionalUpdateAvailable?.(versionData);
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            onError?.(error);
            console.log('Force update check failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchVersionData, currentVersion, onForceUpdateDetected, onOptionalUpdateAvailable, onError]);

    /**
     * Set up app lifecycle listener
     */
    useEffect(() => {
        if (!checkOnAppForeground) return;

        // Check immediately on mount
        manualCheck();

        // Listen for app state changes
        const subscription = AppState.addEventListener('change', (status) => {
            if (status === 'active') {
                manualCheck();
            }
        });

        return () => subscription.remove();
    }, [manualCheck, checkOnAppForeground]);

    return {
        shouldForceUpdate,
        isLoading,
        error,
        openAppStore,
        manualCheck,
    };
};