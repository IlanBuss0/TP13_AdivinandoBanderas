import { Text, View } from "react-native";
import { useGame } from "../context/GameContext";
import { styles } from "./styles";

export default function Leaderboard() {
  const { ranking, rankingReady, storageError } = useGame();

  return (
    <View style={{ gap: 10 }}>
      {storageError && <Text style={styles.error}>No se pudo acceder al ranking guardado.</Text>}
      {!rankingReady && <Text style={styles.subtitle}>Cargando ranking…</Text>}
      {rankingReady && !ranking.length && <Text style={styles.subtitle}>Terminá una partida para aparecer en el ranking.</Text>}
      {ranking.map((entry, index) => (
        <View key={entry.id} style={[styles.card, styles.row, { justifyContent: "space-between" }]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.label}>{index + 1}. {entry.player}</Text>
            <Text style={styles.subtitle}>{entry.mode === "flags" ? "Banderas" : "Capitales"}</Text>
          </View>
          <Text style={styles.label}>{entry.score} puntos</Text>
        </View>
      ))}
    </View>
  );
}

