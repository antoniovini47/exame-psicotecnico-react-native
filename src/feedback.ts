import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const correctSound = createAudioPlayer(require('../assets/sounds/correct.mp3'));
const wrongSound = createAudioPlayer(require('../assets/sounds/incorrect.mp3'));

function play(player: AudioPlayer) {
  player.seekTo(0);
  player.play();
}

export function feedbackCorrect(): void {
  play(correctSound);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function feedbackWrong(): void {
  play(wrongSound);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
