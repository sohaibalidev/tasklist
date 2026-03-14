import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOffline } from '../../context/offline-context';
import { OfflineScreen } from './offline-screen';

interface OfflineWrapperProps {
    children: React.ReactNode;
}

export const OfflineWrapper = ({ children }: OfflineWrapperProps) => {
    const { isConnected, isInternetReachable } = useOffline();

    if (!isConnected || !isInternetReachable) {
        return <OfflineScreen />;
    }

    return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});