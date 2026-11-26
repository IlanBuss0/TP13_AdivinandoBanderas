import { Image } from "expo-image";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function Flag() {
  const { round, flagLoaded, flagFailed, retryFlag, nextCountry } = useGame();
  if (!round) return null;

  const { country, deadline, imageAttempt, imageError } = round;
  const hasBackup = /^[A-Z]{2}$/.test(country.iso2);
  const url = hasBackup && imageAttempt % 2 === 1
    ? "https://flagcdn.com/w640/" + country.iso2.toLowerCase() + ".png"
    : country.flag;

  if (imageError) {
    return (
      <View style={styles.card}>
        <Text style={styles.error}>No se pudo cargar esta bandera.</Text>
        <Pressable accessibilityRole="button" style={[styles.button, styles.secondaryButton]} onPress={retryFlag}>
          <Text style={[styles.buttonText, styles.secondaryText]}>Reintentar imagen</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={[styles.button, styles.secondaryButton]} onPress={nextCountry}>
          <Text style={[styles.buttonText, styles.secondaryText]}>Pasar a otra bandera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={flagStyles.panel}>
      {!deadline && <ActivityIndicator style={StyleSheet.absoluteFill} color="#0369A1" accessibilityLabel="Cargando bandera" />}
      <Image
        key={url + imageAttempt}
        source={url}
        style={flagStyles.image}
        contentFit="contain"
        accessible
        accessibilityLabel="Bandera a adivinar"
        onLoad={() => flagLoaded(round)}
        onError={() => flagFailed(round, hasBackup && imageAttempt % 2 === 0)}
      />
    </View>
  );
}

const flagStyles = StyleSheet.create({
  panel: { backgroundColor: "#F8FAFC", borderRadius: 16, padding: 18 },
  image: { width: "100%", height: 150 },
});

