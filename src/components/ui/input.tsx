import React from 'react';
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Button } from './Button';

type InputVariant = 'default' | 'search' | 'textarea';

interface InputProps extends TextInputProps {
    variant?: InputVariant;
    label?: string;
    required?: boolean;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    leftIcon?: keyof typeof Feather.glyphMap;
    rightIcon?: keyof typeof Feather.glyphMap;
    onRightIconPress?: () => void;
    showClearButton?: boolean;
    onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
    variant = 'default',
    label,
    required = false,
    error,
    containerStyle,
    labelStyle,
    inputStyle,
    leftIcon,
    rightIcon,
    onRightIconPress,
    showClearButton = false,
    onClear,
    value,
    onChangeText,
    multiline,
    ...restProps
}) => {

    const getInputStyles = () => {
        const stylesArray: StyleProp<TextStyle>[] = [styles.input];

        if (variant === 'textarea' || multiline) {
            stylesArray.push(styles.textArea);
        }

        if (variant === 'search') {
            stylesArray.push(styles.searchInput);
        }

        if (error) {
            stylesArray.push(styles.inputError);
        }

        if (leftIcon) {
            stylesArray.push(styles.inputWithLeftIcon);
        }

        if (showClearButton || rightIcon) {
            stylesArray.push(styles.inputWithRightIcon);
        }

        if (inputStyle) {
            stylesArray.push(inputStyle);
        }

        return StyleSheet.flatten(stylesArray);
    };

    const getContainerStyles = () => {
        if (variant === 'search') {
            return StyleSheet.flatten([styles.searchContainer, containerStyle]);
        }
        return StyleSheet.flatten([styles.inputContainer, containerStyle]);
    };

    const renderLeftIcon = () => {
        if (leftIcon) {
            return (
                <Feather
                    name={leftIcon}
                    size={18}
                    color={error ? COLORS.ui.error : COLORS.ui.textSecondary}
                    style={styles.leftIcon}
                />
            );
        }
        return null;
    };

    const renderRightElement = () => {
        if (showClearButton && value && value.length > 0) {
            return (
                <Button
                    variant="icon"
                    icon="x"
                    iconSize={20}
                    iconColor={COLORS.ui.textSecondary}
                    onPress={onClear || (() => onChangeText?.(''))}
                    style={styles.clearButton}
                />
            );
        }

        if (rightIcon) {
            return (
                <Button
                    variant="icon"
                    icon={rightIcon}
                    iconSize={18}
                    iconColor={COLORS.ui.textSecondary}
                    onPress={onRightIconPress}
                    style={styles.rightIcon}
                />
            );
        }

        return null;
    };

    return (
        <View style={getContainerStyles()}>
            {label && variant !== 'search' && (
                <Text style={StyleSheet.flatten([styles.label, labelStyle])}>
                    {label} {required && <Text style={styles.required}>*</Text>}
                </Text>
            )}

            <View style={styles.inputWrapper}>
                {renderLeftIcon()}

                <TextInput
                    style={getInputStyles()}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor={COLORS.ui.textSecondary}
                    multiline={variant === 'textarea' || multiline}
                    textAlignVertical={variant === 'textarea' ? 'top' : 'center'}
                    {...restProps}
                />

                {renderRightElement()}
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.ui.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
        paddingHorizontal: 2,
        paddingVertical: 10,
        gap: 8,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.ui.textSecondary,
        marginBottom: 8,
    },
    required: {
        color: COLORS.ui.error,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.ui.error,
        marginTop: 4,
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.ui.text,
        backgroundColor: COLORS.ui.background,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    searchInput: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        padding: 0,
    },
    inputWithLeftIcon: {
        paddingLeft: 40,
    },
    inputWithRightIcon: {
        paddingRight: 40,
    },
    leftIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    rightIcon: {
        position: 'absolute',
        right: 0,
        zIndex: 1,
    },
    clearButton: {
        position: 'absolute',
        right: 0,
        zIndex: 1,
    },
    inputError: {
        borderColor: COLORS.ui.error,
    },
});