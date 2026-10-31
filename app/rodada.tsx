import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dayKey } from '../src/domain/progress';
import { answerCurrent, currentIndex, isFinished, type Round } from '../src/domain/reasoning';
import { feedbackCorrect, feedbackWrong } from '../src/feedback';
import { completeStep, type FlowParams } from '../src/flow';
import { finishRound, loadRound, newRound, questionById, saveRound } from '../src/session';
import { radius, usePalette } from '../src/theme';
import { Button } from '../src/ui/Button';
import { Icon } from '../src/ui/Icon';
import { Mascot } from '../src/ui/Mascot';
import { OptionRow, type OptionState } from '../src/ui/OptionRow';
import { ProgressBar } from '../src/ui/ProgressBar';
import { Text } from '../src/ui/Text';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function RoundScreen() {
  const router = useRouter();
  const palette = usePalette();
  const params = useLocalSearchParams<{ size?: string; fresh?: string } & FlowParams>();
  const [round, setRound] = useState<Round>(() => (params.fresh ? null : loadRound()) ?? newRound(Number(params.size) || 10));
  const [revealed, setRevealed] = useState<{ index: number; choice: number } | null>(null);

  const index = revealed ? revealed.index : currentIndex(round);
  const total = round.questionIds.length;
  const question = questionById(round.questionIds[index]);
  if (!question) return null;

  function choose(choice: number) {
    if (revealed || !question) return;
    const next = answerCurrent(round, choice);
    saveRound(next);
    setRound(next);
    setRevealed({ index, choice });
    if (choice === question.answer) feedbackCorrect();
    else feedbackWrong();
  }

  function advance() {
    setRevealed(null);
    if (!isFinished(round)) return;
    const summary = finishRound(round, dayKey(new Date()));
    completeStep(
      router,
      {
        skill: 'reasoning',
        correct: summary.correct,
        total: summary.total,
        detail: `${summary.correct} de ${summary.total} certas`,
        wrongIds: summary.wrongIds,
      },
      { ...params, startedAt: params.startedAt ?? String(round.startedAt) },
      true,
    );
  }

  function optionState(i: number): OptionState {
    if (!revealed || !question) return 'idle';
    if (i === question.answer) return 'correct';
    if (i === revealed.choice) return 'wrong';
    return 'dimmed';
  }

  const hit = revealed !== null && revealed.choice === question.answer;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair do treino. O progresso fica salvo."
          onPress={() => router.back()}
          style={[styles.close, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Icon name="close" size={20} color={palette.ink} strokeWidth={2.4} />
        </Pressable>
        <View style={{ flex: 1, gap: 6 }}>
          <Text variant="caption" muted>
            Raciocínio lógico · questão {index + 1} de {total}
          </Text>
          <ProgressBar value={(index + (revealed ? 1 : 0)) / total} color={palette.good} track={palette.track} height={8} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="heading" style={{ fontSize: 20, lineHeight: 27 }}>
          {question.prompt}
        </Text>
        {question.image !== undefined && (
          <View style={[styles.imageBox, { backgroundColor: '#FFFFFF', borderColor: palette.border }]}>
            <Image source={question.image} style={styles.image} resizeMode="contain" accessibilityIgnoresInvertColors />
          </View>
        )}
        <View style={{ gap: 8 }}>
          {question.options.map((option, i) => (
            <OptionRow key={i} letter={LETTERS[i]} label={option} state={optionState(i)} onPress={revealed ? undefined : () => choose(i)} />
          ))}
        </View>

        {revealed && (
          <Animated.View entering={FadeInDown.duration(250)} style={[styles.explain, { backgroundColor: palette.hero }]}>
            <Mascot size={40} mood={hit ? 'happy' : 'neutral'} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="bodyStrong" color={palette.primary}>
                {hit ? 'Acertou!' : `A certa é a ${LETTERS[question.answer]}`}
              </Text>
              <Text color={palette.onHero}>{question.explanation}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {revealed && (
        <View style={styles.footer}>
          <Button label={isFinished(round) ? 'Ver resultado' : 'Próxima'} onPress={advance} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12 },
  close: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, gap: 16 },
  imageBox: { borderWidth: 1, borderRadius: radius.lg, padding: 12, alignItems: 'center' },
  image: { width: '100%', height: 200 },
  explain: { borderRadius: radius.lg, padding: 16, flexDirection: 'row', gap: 12 },
  footer: { paddingHorizontal: 20, paddingBottom: 16 },
});
