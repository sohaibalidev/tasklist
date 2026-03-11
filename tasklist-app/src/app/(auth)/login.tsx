import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/auth-context';

export default function LoginScreen() {
  const { signInWithGoogle, isLoading } = useAuth();
  const [signInLoading, setSignInLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setSignInLoading(true);
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={signInLoading}
        >
          {signInLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  googleIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});