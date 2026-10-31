import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { questionById } from '../src/session';
import { radius, usePalette } from '../src/theme';
import { Card } from '../src/ui/Card';
import { Icon } from '../src/ui/Icon';
import { Text } from '../src/ui/Text';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function Review() {
  const router = useRouter();
  const palette = usePalette();
  const { ids } = useLocalSearchParams<{ ids: string }>();
  const questions = (ids ?? '').split(',').map((id) => questionById(Number(id))).filter((q) => q !== undefined);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={[styles.close, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Icon name="close" size={20} color={palette.ink} strokeWidth={2.4} />
        </Pressable>
        <Text variant="title">Revisão</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {questions.map((q) => (
          <Card key={q.id} style={{ gap: 10 }}>
            <Text variant="bodyStrong">{q.prompt}</Text>
            {q.image !== undefined && (
              <Image source={q.image} style={styles.image} resizeMode="contain" accessibilityIgnoresInvertColors />
            )}
            <View style={[styles.answer, { backgroundColor: palette.goodSoft }]}>
              <Icon name="check" size={20} color={palette.goodInk} strokeWidth={3} />
              <Text variant="bodyStrong" style={{ flex: 1 }}>
                {LETTERS[q.answer]}) {q.options[q.answer]}
              </Text>
            </View>
            <Text muted>{q.explanation}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12 },
  close: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, gap: 12 },
  image: { width: '100%', height: 160, backgroundColor: '#FFFFFF', borderRadius: radius.md },
  answer: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: radius.md, padding: 10 },
});
