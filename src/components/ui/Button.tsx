import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacityProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

type ButtonVariant = 'icon' | 'fab' | 'primary' | 'google' | 'signout' | 'submit';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    icon?: keyof typeof Feather.glyphMap;
    iconSize?: number;
    iconColor?: string;
    children?: React.ReactNode;
    text?: string;
    textStyle?: TextStyle;
    loading?: boolean;
    loadingColor?: string;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'icon',
    icon,
    iconSize = 24,
    iconColor = 'white',
    children,
    text,
    textStyle,
    loading = false,
    loadingColor = '#fff',
    style,
    contentContainerStyle,
    ...touchableProps
}) => {

    const getIconColor = () => {
        if (iconColor) return iconColor;

        switch (variant) {
            case 'fab':
                return COLORS.ui.text;
            case 'signout':
                return '#FF3B30';
            case 'google':
                return '#fff';
            case 'submit':
                return COLORS.ui.background;
            default:
                return COLORS.ui.text;
        }
    };

    const renderContent = () => {
        if (children) {
            return children;
        }

        if (loading) {
            return <ActivityIndicator color={loadingColor} size="small" />;
        }

        switch (variant) {
            case 'fab':
                return (
                    <View style={[styles.fabContent, contentContainerStyle]}>
                        {icon && <Feather name={icon} size={iconSize} color={getIconColor()} />}
                        {text && <Text style={[styles.fabText, textStyle]}>{text}</Text>}
                    </View>
                );

            case 'signout':
                return (
                    <View style={[styles.signOutContent, contentContainerStyle]}>
                        {icon && <Feather name={icon} size={iconSize} color={getIconColor()} />}
                        {text && <Text style={[styles.signOutText, textStyle]}>{text}</Text>}
                    </View>
                );

            case 'google':
                return (
                    <View style={[styles.googleContent, contentContainerStyle]}>
                        <Text style={styles.googleIcon}>G</Text>
                        <Text style={[styles.googleButtonText, textStyle]}>{text}</Text>
                    </View>
                );

            case 'primary':
                return (
                    <View style={[styles.primaryContent, contentContainerStyle]}>
                        {icon && <Feather name={icon} size={iconSize} color={getIconColor()} />}
                        {text && <Text style={[styles.primaryText, textStyle]}>{text}</Text>}
                    </View>
                );

            case 'submit':
                return (
                    <View style={[styles.submitContent, contentContainerStyle]}>
                        {text && <Text style={[styles.submitButtonText, textStyle]}>{text}</Text>}
                        {loading && <ActivityIndicator color={COLORS.ui.background} size="small" />}
                    </View>
                );

            case 'icon':
            default:
                return icon && <Feather name={icon} size={iconSize} color={getIconColor()} />;
        }
    };

    const getButtonStyle = () => {
        switch (variant) {
            case 'fab':
                return [styles.fab, style];
            case 'signout':
                return [styles.signOutButton, style];
            case 'google':
                return [
                    styles.googleButton,
                    touchableProps.disabled && styles.googleButtonDisabled,
                    style,
                ];
            case 'primary':
                return [styles.primaryButton, style];
            case 'submit':
                return [
                    styles.submitButton,
                    touchableProps.disabled && styles.submitButtonDisabled,
                    style,
                ];
            default:
                return style;
        }
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            activeOpacity={variant === 'google' ? 0.8 : 0.6}
            {...touchableProps}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.ui.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabText: {
        color: COLORS.ui.text,
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },

    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.ui.background,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: COLORS.ui.background,
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },

    signOutButton: {
        alignItems: 'center',
        padding: 12,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
        marginHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FF3B30",
    },
    signOutContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signOutText: {
        color: '#FF3B30',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },

    googleButton: {
        backgroundColor: '#4285F4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
    googleButtonDisabled: {
        opacity: 0.6,
    },
    googleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        backgroundColor: '#fff',
        color: '#4285F4',
        width: 24,
        height: 24,
        textAlign: 'center',
        lineHeight: 24,
        borderRadius: 12,
        marginRight: 12,
        fontWeight: 'bold',
        fontSize: 16,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },

    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: COLORS.ui.primary,
    },
    primaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    primaryText: {
        color: COLORS.ui.background,
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },

    submitButton: {
        backgroundColor: COLORS.ui.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: COLORS.ui.background,
        fontSize: 16,
        fontWeight: '600',
    },
});