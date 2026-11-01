import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdBanner } from '../src/ads/AdBanner';
import { maybeShowInterstitial } from '../src/ads/ads';
import { track } from '../src/analytics';
import { overallShare, parseSteps } from '../src/domain/exam';
import { SKILL_LABELS } from '../src/domain/progress';
import { usePalette } from '../src/theme';
import { Button } from '../src/ui/Button';
import { Card } from '../src/ui/Card';
import { Mascot } from '../src/ui/Mascot';
import { ProgressBar } from '../src/ui/ProgressBar';
import { Text } from '../src/ui/Text';

function headline(share: number): string {
  if (share >= 0.8) return 'Mandou bem!';
  if (share >= 0.5) return 'Bom caminho!';
  return 'Bora treinar mais?';
}

export default function Result() {
  const router = useRouter();
  const palette = usePalette();
  const params = useLocalSearchParams<{ steps?: string; minutes?: string }>();
  const steps = parseSteps(params.steps);
  const share = overallShare(steps);
  const wrong = steps.flatMap((step) => step.wrongIds ?? []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <AdBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Animated.View entering={ZoomIn.springify()}>
            <Mascot size={96} mood={share >= 0.5 ? 'happy' : 'neutral'} />
          </Animated.View>
          <Text variant="display" style={{ textAlign: 'center' }}>
            {headline(share)}
          </Text>
          <Text muted style={{ textAlign: 'center' }}>
            {steps.length > 1 ? `${steps.length} etapas` : steps[0]?.detail} em {params.minutes ?? 1} min
          </Text>
        </View>

        {steps.map((step) => {
          const stepShare = step.total ? step.correct / step.total : 0;
          return (
            <Card key={step.skill} style={{ gap: 8 }}>
              <View style={styles.row}>
                <Text variant="bodyStrong">{SKILL_LABELS[step.skill]}</Text>
                <Text variant="bodyStrong">{Math.round(stepShare * 100)}%</Text>
              </View>
              <ProgressBar value={stepShare} color={stepShare >= 0.7 ? palette.good : palette.warn} track={palette.track} />
              {steps.length > 1 && (
                <Text variant="caption" muted>
                  {step.detail}
                </Text>
              )}
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {wrong.length > 0 && (
          <Button
            label={wrong.length === 1 ? 'Revisar o erro' : `Revisar os ${wrong.length} erros`}
            kind="outline"
            onPress={() => {
              track('review_open', { wrong: wrong.length });
              router.push({ pathname: '/revisao', params: { ids: wrong.join(',') } });
            }}
          />
        )}
        <Button
          label="Continuar"
          onPress={() => {
            maybeShowInterstitial();
            router.replace('/');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  hero: { alignItems: 'center', gap: 8, paddingTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: { paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
});
