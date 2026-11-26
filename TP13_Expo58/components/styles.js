import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0F172A" },
  content: { padding: 22, gap: 16, paddingBottom: 30 },
  title: { color: "#F8FAFC", fontSize: 36, fontWeight: "800" },
  subtitle: { color: "#B6C6DB", fontSize: 16, lineHeight: 24 },
  label: { color: "#F8FAFC", fontSize: 16, fontWeight: "700" },
  input: {
    borderColor: "#577295",
    borderWidth: 1,
    backgroundColor: "#18263A",
    borderRadius: 12,
    padding: 14,
    color: "#F8FAFC",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7DD3FC",
    padding: 15,
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: { backgroundColor: "#233751" },
  disabled: { opacity: 0.5 },
  buttonText: { color: "#082238", fontSize: 16, fontWeight: "700", textAlign: "center" },
  secondaryText: { color: "#E0F2FE" },
  card: { backgroundColor: "#18263A", borderRadius: 16, padding: 16, gap: 12 },
  error: { color: "#FECACA", fontSize: 15, lineHeight: 22 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
});

