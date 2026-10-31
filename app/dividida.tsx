import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTrials, scoreTrials, TRIAL_MS, TRIALS_PER_SESSION, type TrialResponse } from '../src/domain/dividedAttention';
import { completeStep, type FlowParams } from '../src/flow';
import { radius, usePalette } from '../src/theme';
import { useDeadline } from '../src/useDeadline';
import { Button } from '../src/ui/Button';
import { Card } from '../src/ui/Card';
import { FigureIcon, FIGURE_LABELS } from '../src/ui/FigureIcon';
import { GameTop } from '../src/ui/GameTop';
import { Text } from '../src/ui/Text';

const NO_RESPONSE: TrialResponse = { even: false, circle: false };

export default function DividedAttention() {
  const router = useRouter();
  const palette = usePalette();
  const params = useLocalSearchParams<FlowParams>();
  const [seed] = useState(() => Date.now());
  const finished = useRef(false);
  const trials = useMemo(() => createTrials(seed), [seed]);
  const responses = useRef<TrialResponse[]>([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<TrialResponse>(NO_RESPONSE);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  useDeadline(deadline, nextTrial);

  function nextTrial() {
    responses.current[index] = response;
    if (index + 1 < trials.length) {
      setIndex(index + 1);
      setResponse(NO_RESPONSE);
      setDeadline((deadline ?? Date.now()) + TRIAL_MS);
      return;
    }
    setDeadline(null);
    const score = scoreTrials(trials, responses.current);
    if (finished.current) return;
    finished.current = true;
    completeStep(
      router,
      {
        skill: 'divided',
        correct: score.hits,
        total: score.targets + score.falseAlarms,
        detail: `${score.hits} de ${score.targets} sinais percebidos · ${score.falseAlarms} ${score.falseAlarms === 1 ? 'toque errado' : 'toques errados'}`,
      },
      params,
    );
  }

  function press(key: keyof TrialResponse) {
    if (response[key]) return;
    Haptics.selectionAsync();
    setResponse({ ...response, [key]: true });
  }

  if (!started) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
        <GameTop caption="Atenção dividida" progress={0} closeLabel="Sair do treino" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="title">Duas coisas ao mesmo tempo</Text>
          <Card style={{ gap: 10 }}>
            <Text>A cada 2 segundos aparecem um número e uma figura. Fique de olho nos dois:</Text>
            <Text variant="bodyStrong">• Número par (2, 4, 6, 8): toque em “Par”.</Text>
            <Text variant="bodyStrong">• Figura for um círculo: toque em “Círculo”.</Text>
            <Text muted>
              Os dois podem acontecer juntos, aí você toca nos dois botões. Se nada disso aparecer, não toque. São {TRIALS_PER_SESSION}{' '}
              rodadas, cerca de {Math.round((TRIALS_PER_SESSION * TRIAL_MS) / 1000)} segundos.
            </Text>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            label="Começar"
            onPress={() => {
              setStarted(true);
              setDeadline(Date.now() + TRIAL_MS);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const trial = trials[index];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <GameTop
        caption={`Atenção dividida · ${index + 1} de ${trials.length}`}
        progress={index / trials.length}
        closeLabel="Sair do treino. Este treino não fica salvo."
      />
      <View style={styles.stage}>
        <Animated.View key={`d${index}`} entering={FadeIn.duration(150)} style={[styles.panel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text variant="display" style={{ fontSize: 88, lineHeight: 100 }} accessibilityLabel={`número ${trial.digit}`}>
            {trial.digit}
          </Text>
        </Animated.View>
        <Animated.View
          key={`s${index}`}
          entering={FadeIn.duration(150)}
          accessible
          accessibilityLabel={FIGURE_LABELS[trial.shape]}
          style={[styles.panel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <FigureIcon name={trial.shape} size={88} color={palette.ink} />
        </Animated.View>
      </View>
      <View style={styles.answers}>
        {(['even', 'circle'] as const).map((key) => {
          const on = response[key];
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => press(key)}
              style={[styles.answer, { backgroundColor: on ? palette.primary : palette.hero }]}>
              <Text variant="heading" color={on ? palette.onPrimary : palette.onHero}>
                {key === 'even' ? 'Par' : 'Círculo'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  stage: { flex: 1, flexDirection: 'row', gap: 12, padding: 20, alignItems: 'center' },
  panel: { flex: 1, aspectRatio: 0.8, borderWidth: 1, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  answers: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingBottom: 20 },
  answer: { flex: 1, height: 96, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 16 },
});
