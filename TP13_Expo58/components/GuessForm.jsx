import { Pressable, Text, TextInput, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function GuessForm() {
  const { answer, setAnswer, suggestions, guess, canGuess } = useGame();
  const disabled = !canGuess || !answer.trim();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>¿De qué país es la bandera?</Text>
      <TextInput
        accessibilityLabel="Nombre del país"
        style={styles.input}
        placeholder="Escribí un país"
        placeholderTextColor="#A5B8CF"
        value={answer}
        onChangeText={setAnswer}
        editable={canGuess}
        autoCorrect={false}
        maxLength={100}
        returnKeyType="go"
        onSubmitEditing={() => guess()}
      />
      {canGuess && suggestions.map((country, index) => (
        <Pressable accessibilityRole="button" key={country.name + index} onPress={() => setAnswer(country.label)} style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryText]}>{country.label}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" onPress={() => guess()} disabled={disabled} style={[styles.button, disabled && styles.disabled]}>
        <Text style={styles.buttonText}>Confirmar respuesta</Text>
      </Pressable>
    </View>
  );
}

