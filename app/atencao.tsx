import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPage, PAGE_SECONDS, PAGES_PER_SESSION, scorePage } from '../src/domain/focusedAttention';
import { addScores, emptyScore, type TaskScore } from '../src/domain/score';
import { completeStep, type FlowParams } from '../src/flow';
import { radius, usePalette } from '../src/theme';
import { useDeadline } from '../src/useDeadline';
import { Button } from '../src/ui/Button';
import { Card } from '../src/ui/Card';
import { GameTop } from '../src/ui/GameTop';
import { Glyph, GLYPH_LABELS } from '../src/ui/Glyph';
import { Text } from '../src/ui/Text';

const COLUMNS = 6;
const GAP = 6;

export default function FocusedAttention() {
  const router = useRouter();
  const palette = usePalette();
  const params = useLocalSearchParams<FlowParams>();
  const { width } = useWindowDimensions();
  const [seed] = useState(() => Date.now());
  const finished = useRef(false);
  const pages = useMemo(() => Array.from({ length: PAGES_PER_SESSION }, (_, i) => createPage(seed + i)), [seed]);
  const [pageIndex, setPageIndex] = useState(0);
  const [marked, setMarked] = useState<number[]>([]);
  const [score, setScore] = useState<TaskScore>(emptyScore);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const page = pages[pageIndex];
  const remaining = useDeadline(deadline, finishPage);
  const cell = Math.floor((width - 40 - GAP * (COLUMNS - 1)) / COLUMNS);

  function finishPage() {
    const total = addScores(score, scorePage(page, marked));
    if (pageIndex + 1 < pages.length) {
      setScore(total);
      setPageIndex(pageIndex + 1);
      setMarked([]);
      setDeadline(Date.now() + PAGE_SECONDS * 1000);
      return;
    }
    setDeadline(null);
    if (finished.current) return;
    finished.current = true;
    completeStep(
      router,
      {
        skill: 'focused',
        correct: total.hits,
        total: total.targets + total.falseAlarms,
        detail: `${total.hits} de ${total.targets} alvos · ${total.falseAlarms} ${total.falseAlarms === 1 ? 'marcação errada' : 'marcações erradas'}`,
      },
      params,
    );
  }

  function toggle(i: number) {
    setMarked((current) => (current.includes(i) ? current.filter((x) => x !== i) : [...current, i]));
  }

  if (!started) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
        <GameTop caption="Atenção concentrada" progress={0} closeLabel="Sair do treino" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="title">Ache o símbolo certo</Text>
          <Card style={{ gap: 10 }}>
            <Text>No topo de cada tela aparece um símbolo-alvo. Toque em todos os símbolos iguais a ele na grade.</Text>
            <View style={styles.example}>
              <Glyph name="up" size={36} color={palette.ink} />
              <Glyph name="left" size={36} color={palette.inkMuted} />
              <Glyph name="up" size={36} color={palette.ink} />
              <Glyph name="square" size={36} color={palette.inkMuted} />
              <Glyph name="down" size={36} color={palette.inkMuted} />
            </View>
            <Text muted>
              São {PAGES_PER_SESSION} telas de {PAGE_SECONDS} segundos. Tocou errado? Toque de novo para desmarcar. Cada marcação errada
              conta contra você, como no exame.
            </Text>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            label="Começar"
            onPress={() => {
              setStarted(true);
              setDeadline(Date.now() + PAGE_SECONDS * 1000);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const seconds = Math.ceil(remaining / 1000);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <GameTop
        caption={`Atenção concentrada · tela ${pageIndex + 1} de ${pages.length}`}
        progress={(pageIndex + 1 - remaining / (PAGE_SECONDS * 1000)) / pages.length}
        closeLabel="Sair do treino. Este treino não fica salvo."
      />
      <View style={[styles.targetBar, { backgroundColor: palette.hero }]}>
        <Text variant="bodyStrong" color={palette.onHero}>
          Marque todos os
        </Text>
        <View accessible accessibilityLabel={GLYPH_LABELS[page.target]} style={[styles.targetChip, { backgroundColor: palette.surface }]}>
          <Glyph name={page.target} size={30} color={palette.ink} />
        </View>
        <Text variant="heading" color={seconds <= 5 ? palette.primary : palette.onHero} style={{ marginLeft: 'auto' }}>
          {seconds} s
        </Text>
      </View>
      <ScrollView contentContainerStyle={[styles.grid, { gap: GAP }]}>
        {page.cells.map((glyph, i) => {
          const on = marked.includes(i);
          return (
            <Pressable
              key={`${pageIndex}-${i}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={GLYPH_LABELS[glyph]}
              onPress={() => toggle(i)}
              style={[
                styles.cell,
                {
                  width: cell,
                  height: cell,
                  backgroundColor: on ? palette.primarySoft : palette.surface,
                  borderColor: on ? palette.primary : palette.border,
                },
              ]}>
              <Glyph name={glyph} size={cell * 0.55} color={palette.ink} />
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <Button label={pageIndex + 1 < pages.length ? 'Próxima tela' : 'Terminar'} kind="dark" onPress={finishPage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  example: { flexDirection: 'row', gap: 14, justifyContent: 'center', paddingVertical: 6 },
  targetBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, padding: 12, borderRadius: radius.lg },
  targetChip: { borderRadius: radius.sm, padding: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20 },
  cell: { borderWidth: 2, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 16 },
});
