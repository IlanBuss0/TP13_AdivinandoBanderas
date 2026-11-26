import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GameProvider } from "../../context/GameContext";

export default function Layout() {
  return (
    <GameProvider>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0F172A" } }}>
        <Stack.Screen name="game" options={{ gestureEnabled: false }} />
      </Stack>
    </GameProvider>
  );
}

