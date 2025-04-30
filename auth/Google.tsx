// Install required packages:
// expo install expo-auth-session expo-web-browser expo-random

import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Random from 'expo-random';

// Register your web app at https://console.cloud.google.com/apis/credentials
// Make sure to add your redirect URI (typically https://auth.expo.io/@your-username/your-app-slug)
// to the list of authorized redirect URIs

// Initialize WebBrowser for AuthSession
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Configuration for Google OAuth
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };
  
  const CLIENT_ID = '1071231538092-08t5krr606e2k8pqjsssfgl09dru3tm5.apps.googleusercontent.com';

  // Generate a random state string for security
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const signInAsync = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate state for CSRF protection
      const state = await generateRandomState();

      // Configure the authentication request
      const request = new AuthSession.AuthRequest({
        clientId: CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        responseType: 'code',
        scopes: ['profile', 'email'],
        state,
        usePKCE: true, // Use PKCE for additional security
      });

      // Start the authentication flow
      const response = await request.promptAsync(discovery, { useProxy: true });

      if (response.type === 'success') {
        // Exchange the authorization code for tokens
        const { code } = response.params;
        const tokenResult = await exchangeCodeForToken(
          code,
          request.redirectUri,
          request.codeVerifier
        );

        // Get user information with the received access token
        const userInfoResponse = await fetchUserInfo(tokenResult.access_token);
        setUserInfo(userInfoResponse);
      } else {
        setError('Authentication was canceled or failed');
      }
    } catch (e: any) {
      setError(e.message);
      console.error('Sign in error:', e);
    } finally {
      setLoading(false);
    }
  };

  const exchangeCodeForToken = async (code, redirectUri, codeVerifier) => {
    const tokenRequest = {
      code,
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    };

    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.entries(tokenRequest)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&'),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  };

  const fetchUserInfo = async (accessToken) => {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  };

  const signOut = () => {
    setUserInfo(null);
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.userInfoContainer}>
          {userInfo.picture && (
            <Image 
              source={{ uri: userInfo.picture }} 
              style={styles.profilePic} 
            />
          )}
          <Text style={styles.title}>Welcome, {userInfo.name}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      ) : (
        <View>
          <Button 
            title={loading ? "Signing in..." : "Sign in with Google"} 
            onPress={signInAsync} 
            disabled={loading} 
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});