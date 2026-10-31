import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addScores, emptyScore, type TaskScore } from '../src/domain/score';
import { createLevel, LEVEL_SIZES, scoreLevel, STUDY_MS_PER_FIGURE, type Figure } from '../src/domain/visualMemory';
import { feedbackCorrect, feedbackWrong } from '../src/feedback';
import { completeStep, type FlowParams } from '../src/flow';
import { radius, usePalette, type Palette } from '../src/theme';
import { useDeadline } from '../src/useDeadline';
import { Button } from '../src/ui/Button';
import { Card } from '../src/ui/Card';
import { FigureIcon, FIGURE_LABELS } from '../src/ui/FigureIcon';
import { GameTop } from '../src/ui/GameTop';
import { Text } from '../src/ui/Text';

type Phase = 'intro' | 'study' | 'recall' | 'checked';

const COLUMNS = 4;
const GAP = 10;

function tileColors(palette: Palette, phase: Phase, shown: boolean, picked: boolean) {
  if (phase === 'checked') {
    if (shown && picked) return { background: palette.goodSoft, border: palette.good };
    if (shown) return { background: palette.surface, border: palette.warn };
    if (picked) return { background: palette.badSoft, border: palette.bad };
    return { background: palette.surface, border: palette.border };
  }
  return picked ? { background: palette.primarySoft, border: palette.primary } : { background: palette.surface, border: palette.border };
}

export default function VisualMemory() {
  const router = useRouter();
  const palette = usePalette();
  const params = useLocalSearchParams<FlowParams>();
  const { width } = useWindowDimensions();
  const [seed] = useState(() => Date.now());
  const finished = useRef(false);
  const levels = useMemo(() => LEVEL_SIZES.map((size, i) => createLevel(seed + i, size)), [seed]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [picked, setPicked] = useState<Figure[]>([]);
  const [score, setScore] = useState<TaskScore>(emptyScore);
  const [deadline, setDeadline] = useState<number | null>(null);

  const level = levels[levelIndex];
  const studyMs = level.shown.length * STUDY_MS_PER_FIGURE;
  const remaining = useDeadline(deadline, () => {
    setDeadline(null);
    setPhase('recall');
  });
  const tile = Math.floor((width - 40 - GAP * (COLUMNS - 1)) / COLUMNS);

  function study(index: number) {
    setLevelIndex(index);
    setPicked([]);
    setPhase('study');
    setDeadline(Date.now() + levels[index].shown.length * STUDY_MS_PER_FIGURE);
  }

  function check() {
    const levelScore = scoreLevel(level, picked);
    setScore(addScores(score, levelScore));
    setPhase('checked');
    if (levelScore.misses === 0 && levelScore.falseAlarms === 0) feedbackCorrect();
    else feedbackWrong();
  }

  function next() {
    if (levelIndex + 1 < levels.length) {
      study(levelIndex + 1);
      return;
    }
    if (finished.current) return;
    finished.current = true;
    completeStep(
      router,
      {
        skill: 'memory',
        correct: score.hits,
        total: score.targets + score.falseAlarms,
        detail: `${score.hits} de ${score.targets} figuras lembradas · ${score.falseAlarms} ${score.falseAlarms === 1 ? 'escolha errada' : 'escolhas erradas'}`,
      },
      params,
    );
  }

  function toggle(figure: Figure) {
    setPicked((current) => (current.includes(figure) ? current.filter((f) => f !== figure) : [...current, figure]));
  }

  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
        <GameTop caption="Memória visual" progress={0} closeLabel="Sair do treino" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="title">Grave as figuras</Text>
          <Card style={{ gap: 10 }}>
            <Text>Algumas figuras aparecem por alguns segundos. Depois elas se misturam com outras, e você marca só as que viu.</Text>
            <Text muted>
              São {LEVEL_SIZES.length} níveis, com {LEVEL_SIZES.join(', ')} figuras. Você tem {String(STUDY_MS_PER_FIGURE / 1000).replace('.', ',')} segundos por figura
              para memorizar. Marcar uma figura que não apareceu conta como erro.
            </Text>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button label="Começar" onPress={() => study(0)} />
        </View>
      </SafeAreaView>
    );
  }

  const figures = phase === 'study' ? level.shown : level.choices;
  const levelScore = phase === 'checked' ? scoreLevel(level, picked) : null;
  const stepProgress = phase === 'study' ? 1 - remaining / studyMs : 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <GameTop
        caption={`Memória visual · nível ${levelIndex + 1} de ${levels.length}`}
        progress={(levelIndex + (phase === 'checked' ? 1 : stepProgress * 0.5)) / levels.length}
        closeLabel="Sair do treino. Este treino não fica salvo."
      />
      <View style={[styles.banner, { backgroundColor: palette.hero }]}>
        <Text variant="bodyStrong" color={palette.onHero} style={{ flex: 1 }}>
          {phase === 'study' && `Memorize estas ${level.shown.length} figuras`}
          {phase === 'recall' && `Marque as ${level.shown.length} figuras que você viu`}
          {phase === 'checked' &&
            levelScore &&
            `${levelScore.hits} de ${levelScore.targets} certas${levelScore.falseAlarms ? ` · ${levelScore.falseAlarms} erradas` : ''}`}
        </Text>
        {phase === 'study' && (
          <Text variant="heading" color={palette.primary}>
            {Math.ceil(remaining / 1000)} s
          </Text>
        )}
        {phase === 'recall' && (
          <Text variant="heading" color={palette.primary}>
            {picked.length}/{level.shown.length}
          </Text>
        )}
      </View>
      <ScrollView contentContainerStyle={[styles.grid, { gap: GAP }]}>
        {figures.map((figure) => {
          const isPicked = picked.includes(figure);
          const colors = tileColors(palette, phase, level.shown.includes(figure), isPicked);
          return (
            <Pressable
              key={`${phase === 'study' ? 's' : 'c'}-${figure}`}
              disabled={phase !== 'recall'}
              accessibilityRole={phase === 'recall' ? 'checkbox' : 'image'}
              accessibilityState={phase === 'recall' ? { checked: isPicked } : undefined}
              accessibilityLabel={FIGURE_LABELS[figure]}
              onPress={() => toggle(figure)}
              style={[styles.tile, { width: tile, height: tile, backgroundColor: colors.background, borderColor: colors.border }]}>
              <FigureIcon name={figure} size={tile * 0.55} color={palette.ink} />
            </Pressable>
          );
        })}
      </ScrollView>
      {phase === 'checked' && (
        <View style={styles.legend}>
          <Legend color={palette.good} label="lembrou" />
          <Legend color={palette.warn} label="faltou" />
          <Legend color={palette.bad} label="não apareceu" />
        </View>
      )}
      <View style={styles.footer}>
        {phase === 'recall' && <Button label="Conferir" onPress={check} />}
        {phase === 'checked' && <Button label={levelIndex + 1 < levels.length ? 'Próximo nível' : 'Ver resultado'} onPress={next} />}
      </View>
    </SafeAreaView>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { borderColor: color }]} />
      <Text variant="caption" muted>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, padding: 14, borderRadius: radius.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20 },
  tile: { borderWidth: 2.5, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 14, height: 14, borderRadius: 4, borderWidth: 2.5 },
  footer: { paddingHorizontal: 20, paddingBottom: 16, minHeight: 72 },
});
