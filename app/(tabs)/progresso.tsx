import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdBanner } from '../../src/ads/AdBanner';
import { adFreeUntil, isRewardedReady, showRewarded } from '../../src/ads/ads';
import { currentStreak, dayKey, emptyProgress, lastShareBySkill, SKILL_LABELS, type Progress, type Skill } from '../../src/domain/progress';
import { ProgressBar } from '../../src/ui/ProgressBar';
import { loadProgress } from '../../src/session';
import { radius, usePalette } from '../../src/theme';
import { Button } from '../../src/ui/Button';
import { Card } from '../../src/ui/Card';
import { Icon } from '../../src/ui/Icon';
import { Text } from '../../src/ui/Text';

const BAR_MAX_HEIGHT = 96;

export default function ProgressScreen() {
  const palette = usePalette();
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [adFree, setAdFree] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      setProgress(loadProgress());
      setAdFree(adFreeUntil());
    }, []),
  );

  const streak = currentStreak(progress, dayKey(new Date()));
  const recent = progress.history.slice(-5);
  const adFreeActive = adFree !== null && adFree > Date.now();
  const bySkill = lastShareBySkill(progress);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: palette.background }}>
      <AdBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title">Seu progresso</Text>

        <View style={[styles.hero, { backgroundColor: palette.hero }]}>
          <Icon name="flame" size={28} color={palette.primary} strokeWidth={2.2} />
          <Text variant="heading" color={palette.onHero}>
            {streak === 1 ? '1 dia seguido' : `${streak} dias seguidos`}
          </Text>
        </View>

        <Card style={{ gap: 12 }}>
          <Text variant="bodyStrong">Acertos nos últimos treinos</Text>
          {recent.length === 0 ? (
            <Text muted>Faça o primeiro treino para ver sua evolução aqui.</Text>
          ) : (
            <View style={styles.bars}>
              {recent.map((entry, i) => {
                const share = entry.total ? entry.correct / entry.total : 0;
                const isLast = i === recent.length - 1;
                return (
                  <View key={`${entry.day}-${i}`} style={styles.barColumn}>
                    <Text variant="caption">{Math.round(share * 100)}%</Text>
                    <View
                      style={{
                        width: '100%',
                        height: Math.max(8, share * BAR_MAX_HEIGHT),
                        borderRadius: 8,
                        backgroundColor: isLast ? palette.primary : palette.track,
                      }}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        <Card style={{ gap: 12 }}>
          <Text variant="bodyStrong">Último resultado por habilidade</Text>
          {(Object.keys(SKILL_LABELS) as Skill[]).map((skill) => {
            const share = bySkill[skill];
            return (
              <View key={skill} style={{ gap: 6 }}>
                <View style={styles.row}>
                  <Text>{SKILL_LABELS[skill]}</Text>
                  <Text variant="bodyStrong">{share === undefined ? '—' : `${Math.round(share * 100)}%`}</Text>
                </View>
                <ProgressBar value={share ?? 0} color={(share ?? 0) >= 0.7 ? palette.good : palette.warn} track={palette.track} height={8} />
              </View>
            );
          })}
        </Card>

        <Card>
          <View style={styles.row}>
            <Text variant="bodyStrong">Questões resolvidas</Text>
            <Text variant="heading">{progress.questionsSolved}</Text>
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <View style={styles.row}>
            <Icon name="gift" color={palette.ink} />
            <Text variant="bodyStrong" style={{ flex: 1 }}>
              24 horas sem anúncio de tela cheia
            </Text>
          </View>
          {adFreeActive ? (
            <Text muted>Ativo até {new Date(adFree as number).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}.</Text>
          ) : (
            <>
              <Text muted>Assista a um vídeo curto e treine sem interrupção por um dia inteiro.</Text>
              <Button label="Assistir vídeo" kind="outline" disabled={!isRewardedReady()} onPress={showRewarded} />
            </>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  hero: { borderRadius: radius.xl, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, height: BAR_MAX_HEIGHT + 24 },
  barColumn: { flex: 1, alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
});
