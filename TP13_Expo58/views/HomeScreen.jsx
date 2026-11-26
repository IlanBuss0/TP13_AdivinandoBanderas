import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../components/styles";
import { useGame } from "../context/GameContext";

export default function HomeScreen() {
  const router = useRouter();
  const {
    playerName, setPlayerName, startGame, rankingReady,
    loading, countriesError, capitalsError, canPlayCapitals, reloadCountries,
  } = useGame();
  const ready = Boolean(playerName.trim() && rankingReady && !loading && !countriesError);
  const capitalReady = ready && canPlayCapitals;

  /** @param {import("../context/gameRules").GameMode} mode */
  function play(mode) {
    if (startGame(mode)) router.push("/game");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={styles.title}>Adivinando Banderas</Text>
        <Text style={styles.subtitle}>Adiviná el país o su capital antes de que se agoten los 15 segundos.</Text>

        <Text style={styles.label}>Nombre del jugador</Text>
        <TextInput
          accessibilityLabel="Nombre del jugador"
          autoCapitalize="words"
          maxLength={24}
          placeholder="Escribí tu nombre"
          placeholderTextColor="#A5B8CF"
          value={playerName}
          onChangeText={setPlayerName}
          style={styles.input}
        />

        {loading && <ActivityIndicator color="#7DD3FC" accessibilityLabel="Cargando países" />}
        {countriesError && <Text style={styles.error}>No se pudieron cargar las banderas.</Text>}
        {capitalsError && <Text style={styles.error}>No se pudieron cargar las capitales.</Text>}
        {(countriesError || capitalsError) && (
          <Pressable accessibilityRole="button" style={[styles.button, styles.secondaryButton]} onPress={reloadCountries}>
            <Text style={[styles.buttonText, styles.secondaryText]}>Reintentar conexión</Text>
          </Pressable>
        )}

        <Pressable accessibilityRole="button" disabled={!ready} style={[styles.button, !ready && styles.disabled]} onPress={() => play("flags")}>
          <Text style={styles.buttonText}>Adivinar el país</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={!capitalReady} style={[styles.button, !capitalReady && styles.disabled]} onPress={() => play("capitals")}>
          <Text style={styles.buttonText}>Adivinar la capital</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={[styles.button, styles.secondaryButton]} onPress={() => router.push("/ranking")}>
          <Text style={[styles.buttonText, styles.secondaryText]}>Ver ranking</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

