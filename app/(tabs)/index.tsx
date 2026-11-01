import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdBanner } from '../../src/ads/AdBanner';
import { currentStreak, dayKey } from '../../src/domain/progress';
import { PAGE_SECONDS, PAGES_PER_SESSION } from '../../src/domain/focusedAttention';
import { TRIAL_MS, TRIALS_PER_SESSION } from '../../src/domain/dividedAttention';
import { LEVEL_SIZES } from '../../src/domain/visualMemory';
import { startFlow, startQuickRound } from '../../src/flow';
import { currentIndex, type Round } from '../../src/domain/reasoning';
import { loadProgress, loadRound, QUICK_ROUND_SIZE } from '../../src/session';
import { radius, usePalette } from '../../src/theme';
import { Button } from '../../src/ui/Button';
import { Icon } from '../../src/ui/Icon';
import { Mascot } from '../../src/ui/Mascot';
import { ProgressBar } from '../../src/ui/ProgressBar';
import { SkillTile } from '../../src/ui/SkillTile';
import { Text } from '../../src/ui/Text';

export default function Home() {
  const router = useRouter();
  const palette = usePalette();
  const [round, setRound] = useState<Round | null>(null);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRound(loadRound());
      setStreak(currentStreak(loadProgress(), dayKey(new Date())));
    }, []),
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: palette.background }}>
      <AdBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Mascot />
          <View style={{ flex: 1 }}>
            <Text variant="title">Bora treinar?</Text>
            <Text variant="caption" muted>
              Treino rápido: {QUICK_ROUND_SIZE} questões
            </Text>
          </View>
          <View style={[styles.streak, { backgroundColor: palette.primarySoft }]} accessibilityLabel={streak === 1 ? '1 dia seguido de treino' : `${streak} dias seguidos de treino`}>
            <Icon name="flame" size={16} color={palette.flame} strokeWidth={2.2} />
            <Text variant="bodyStrong">{streak}</Text>
          </View>
        </View>

        <View style={[styles.hero, { backgroundColor: palette.hero }]}>
          <Text variant="label" color={palette.primary}>
            {round ? 'Continuar de onde parou' : 'Treino do dia'}
          </Text>
          <Text variant="heading" color={palette.onHero}>
            Raciocínio lógico
          </Text>
          {round && (
            <>
              <ProgressBar value={currentIndex(round) / round.questionIds.length} color={palette.primary} track={palette.heroTrack} />
              <Text variant="caption" color={palette.onHeroMuted}>
                {currentIndex(round)} de {round.questionIds.length} questões
              </Text>
            </>
          )}
          <Button
            label={round ? 'Continuar' : 'Começar'}
            onPress={() => startQuickRound(router)}
          />
        </View>

        <Text variant="heading">Treinar por habilidade</Text>
        <View style={styles.grid}>
          <SkillTile
            title="Atenção concentrada"
            icon="target"
            detail={`${PAGES_PER_SESSION} telas de ${PAGE_SECONDS} s`}
            onPress={() => startFlow(router, ['focused'])}
          />
          <SkillTile
            title="Atenção dividida"
            icon="split"
            detail={`${TRIALS_PER_SESSION} rodadas de ${TRIAL_MS / 1000} s`}
            onPress={() => startFlow(router, ['divided'])}
          />
          <SkillTile title="Memória visual" icon="memory" detail={`${LEVEL_SIZES.length} níveis`} onPress={() => startFlow(router, ['memory'])} />
          <SkillTile
            title="Raciocínio lógico"
            icon="trend"
            detail={`${QUICK_ROUND_SIZE} questões`}
            onPress={() => startQuickRound(router)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  hero: { borderRadius: radius.xl, padding: 18, gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
