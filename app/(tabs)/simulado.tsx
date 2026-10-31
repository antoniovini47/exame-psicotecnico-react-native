import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FULL_EXAM } from '../../src/domain/exam';
import { SKILL_LABELS } from '../../src/domain/progress';
import { startFlow } from '../../src/flow';
import { EXAM_ROUND_SIZE, loadRound } from '../../src/session';
import { usePalette } from '../../src/theme';
import { Button } from '../../src/ui/Button';
import { Card } from '../../src/ui/Card';
import { Mascot } from '../../src/ui/Mascot';
import { Text } from '../../src/ui/Text';

export default function Exam() {
  const router = useRouter();
  const palette = usePalette();
  const [hasRound, setHasRound] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setHasRound(loadRound() !== null);
    }, []),
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title">Simulado</Text>
        <Card style={styles.card}>
          <Mascot size={72} />
          <Text variant="heading">As 4 habilidades em sequência</Text>
          <View style={{ gap: 6 }}>
            {FULL_EXAM.map((skill, i) => (
              <Text key={skill} variant="bodyStrong">
                {i + 1}. {SKILL_LABELS[skill]}
                {skill === 'reasoning' ? ` (${EXAM_ROUND_SIZE} questões)` : ''}
              </Text>
            ))}
          </View>
          <Text muted>No fim você vê o resultado de cada etapa e pode revisar as questões que errou.</Text>
          {hasRound && (
            <Text variant="caption" color={palette.badInk}>
              Começar agora substitui o treino de raciocínio que está em andamento.
            </Text>
          )}
          <Button label="Começar simulado" kind="dark" onPress={() => startFlow(router, FULL_EXAM)} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  card: { gap: 12, alignItems: 'stretch' },
});
