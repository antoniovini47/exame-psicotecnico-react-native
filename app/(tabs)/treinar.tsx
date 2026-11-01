import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUICK_ROUND_SIZE } from '../../src/session';
import { PAGE_SECONDS, PAGES_PER_SESSION } from '../../src/domain/focusedAttention';
import { TRIAL_MS, TRIALS_PER_SESSION } from '../../src/domain/dividedAttention';
import { LEVEL_SIZES } from '../../src/domain/visualMemory';
import { startFlow, startQuickRound } from '../../src/flow';
import { usePalette } from '../../src/theme';
import { SkillTile } from '../../src/ui/SkillTile';
import { Text } from '../../src/ui/Text';

export default function Train() {
  const router = useRouter();
  const palette = usePalette();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title">Treinar</Text>
        <Text muted>Escolha uma habilidade. Cada treino leva poucos minutos. No raciocínio, o progresso fica salvo se você sair no meio.</Text>
        <View style={styles.grid}>
          <SkillTile
            title="Raciocínio lógico"
            icon="trend"
            detail={`${QUICK_ROUND_SIZE} questões`}
            onPress={() => startQuickRound(router)}
          />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
