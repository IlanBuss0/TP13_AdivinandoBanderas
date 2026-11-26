import { Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function Timer() {
  const { round } = useGame();
  if (!round) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.subtitle}>Tiempo</Text>
      <Text style={[styles.label, round.seconds <= 5 && styles.error]}>{round.seconds} s</Text>
    </View>
  );
}

