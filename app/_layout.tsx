import { ElevenLabsProvider } from "@/elevenlabs/react-native";
import { ClerkProvider, tokenCache } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React from "react";


function RootLayoutWithAuth() {
  const { isSignedIn, isLoaded } = useAuth()


  if(!isLoaded) {
    // Loading
    return null
  }


  return (
    <ElevenLabsProvider>
      <Stack>
        <Stack.Protected guard={isSignedIn} >
          <Stack.screen name="(protected)" />
        </Stack.Protected>

        <Stack.Protected guard={!isSignedIn}>
          <Stack.screen name="(public)" options={{ headerShown: false }}/>
        </Stack.Protected>
      </Stack>
    </ElevenLabsProvider>
  )
}


export default function RootLayout() {  
  return (
      <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHIBLE_KEY}>
        <RootLayoutWithAuth />
      </ClerkProvider>
  );
}

