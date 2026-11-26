import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Leaderboard from "../components/Leaderboard";
import { styles } from "../components/styles";

export default function RankingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>Ranking</Text>
        <Leaderboard />
        <Pressable accessibilityRole="button" style={[styles.button, styles.secondaryButton]} onPress={() => router.back()}>
          <Text style={[styles.buttonText, styles.secondaryText]}>Volver al inicio</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

