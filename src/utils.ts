import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { VersionCheckResponse } from './types';

/**
 * Get store URLs for opening the app store
 */
export const getStoreUrls = () => {
    const webUrl = Platform.select({
        android: Constants.expoConfig?.android?.playStoreUrl || '',
        ios: Constants.expoConfig?.ios?.appStoreUrl || '',
    }) as string;

    if (Platform.OS === 'android') {
        const packageName = Constants.expoConfig?.android?.package;
        return {
            nativeUrl: packageName ? `market://details?id=${packageName}` : undefined,
            webUrl,
        };
    }

    // iOS
    const appStoreId = webUrl?.match(/id(\d+)/)?.[1];
    return {
        nativeUrl: appStoreId ? `itms-apps://apps.apple.com/app/id${appStoreId}` : undefined,
        webUrl,
    };
};

/**
 * Compare versions and determine if update is required
 * @param remoteVersion - Version from API (e.g., "2.0.0")
 * @param currentVersion - Current installed version (e.g., "1.0.0")
 * @param isForceUpdate - Whether this is a force update
 * @returns true if app needs to update
 */
export const isUpdateRequired = (
    remoteVersion: string,
    currentVersion: string,
    isForceUpdate: boolean
): boolean => {
    if (!remoteVersion || !currentVersion || !isForceUpdate) {
        return false;
    }

    // Simple version comparison (assumes semantic versioning)
    // For "1.0.0" vs "2.0.0", this checks if they're different
    return remoteVersion.trim() !== currentVersion.trim();
};

/**
 * Open the app store
 */
export const openAppStore = async (): Promise<void> => {
    const { nativeUrl, webUrl } = getStoreUrls();

    if (nativeUrl) {
        try {
            await Linking.openURL(nativeUrl);
            return;
        } catch (error) {
            console.log('Failed to open store app, falling back to web URL', error);
        }
    }

    if (webUrl) {
        try {
            await Linking.openURL(webUrl);
            return;
        } catch (error) {
            console.log('Failed to open store', error);
            throw error;
        }
    }

    throw new Error('No store URL available for your platform');
};