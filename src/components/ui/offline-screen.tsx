import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Network from 'expo-network';
import { COLORS } from '../../constants/colors';

export const OfflineScreen = () => {
    const [isChecking, setIsChecking] = useState(false);

    const handleRetry = async () => {
        setIsChecking(true);
        try {
            const state = await Network.getNetworkStateAsync();
            if (state.isConnected && state.isInternetReachable) {
                setIsChecking(false);
            }
        } catch (error) {
            console.error('Retry failed:', error);
        }
        setIsChecking(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Feather name="wifi-off" size={80} color={COLORS.ui.textSecondary} />
                </View>

                <Text style={styles.title}>No Internet Connection</Text>

                <Text style={styles.message}>
                    You&apos;re currently offline. Please check your internet connection and try again.
                </Text>

                <TouchableOpacity
                    style={[styles.retryButton, isChecking && styles.retryButtonDisabled]}
                    onPress={handleRetry}
                    disabled={isChecking}
                >
                    {isChecking ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <>
                            <Feather name="refresh-cw" size={20} color="#FFFFFF" />
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ui.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 40,
        alignItems: 'center',
        maxWidth: 400,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.ui.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: COLORS.ui.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    networkInfo: {
        fontSize: 14,
        color: COLORS.ui.textSecondary,
        fontStyle: 'italic',
        marginBottom: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.priority.medium,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        minWidth: 160,
    },
    retryButtonDisabled: {
        opacity: 0.7,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});