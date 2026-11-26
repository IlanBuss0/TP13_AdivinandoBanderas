import { Pressable, Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function CapitalOptions() {
  const { capitalOptions, canGuess, guess } = useGame();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>¿Cuál es la capital de este país?</Text>
      <Text style={styles.subtitle}>Cada 5 segundos se elimina una opción incorrecta.</Text>
      {capitalOptions.map((option) => (
        <Pressable accessibilityRole="button" key={option} disabled={!canGuess} onPress={() => guess(option)} style={[styles.button, !canGuess && styles.disabled]}>
          <Text style={styles.buttonText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

