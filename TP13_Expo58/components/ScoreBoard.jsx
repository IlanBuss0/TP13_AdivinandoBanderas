import { Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function ScoreBoard() {
  const { session } = useGame();
  if (!session) return null;

  return (
    <View style={[styles.card, { flexGrow: 1 }]}>
      <Text style={styles.subtitle}>{session.player}</Text>
      <Text style={styles.label}>Puntaje {session.score}</Text>
    </View>
  );
}

