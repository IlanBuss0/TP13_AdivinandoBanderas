import { Pressable, Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function Hints() {
  const { round, hintAvailable, requestHint } = useGame();
  if (!round) return null;

  const hint = Array.from(round.country.label).map((letter, index) =>
    round.revealed.includes(index) || !/\p{L}/u.test(letter) ? letter : "_",
  ).join(" ");

  return (
    <View style={styles.card}>
      {round.revealed.length > 0 && <Text style={styles.label}>{hint}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={!hintAvailable}
        style={[styles.button, styles.secondaryButton, !hintAvailable && styles.disabled]}
        onPress={requestHint}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>Revelar una letra (−2 s)</Text>
      </Pressable>
    </View>
  );
}

