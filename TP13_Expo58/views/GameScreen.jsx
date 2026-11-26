import { Redirect, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CapitalOptions from "../components/CapitalOptions";
import Flag from "../components/Flag";
import GuessForm from "../components/GuessForm";
import Hints from "../components/Hints";
import ScoreBoard from "../components/ScoreBoard";
import Timer from "../components/Timer";
import { styles } from "../components/styles";
import { useGame } from "../context/GameContext";

export default function GameScreen() {
  const router = useRouter();
  const { session, message, finishGame } = useGame();
  const goBack = useCallback(() => {
    finishGame();
    router.back();
    return true;
  }, [finishGame, router]);

  useFocusEffect(useCallback(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => listener.remove();
  }, [goBack]));

  if (!session) return <Redirect href="/" />;
  const isFlags = session.mode === "flags";

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text accessibilityRole="header" style={styles.title}>{isFlags ? "Banderas" : "Capitales"}</Text>
          <View style={styles.row}>
            <ScoreBoard />
            <Timer />
          </View>
          <Flag />
          {message ? <Text accessibilityLiveRegion="polite" style={styles.subtitle}>{message}</Text> : null}
          {isFlags ? <><GuessForm /><Hints /></> : <CapitalOptions />}
          <Pressable accessibilityRole="button" onPress={goBack} style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryText]}>Terminar partida</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

