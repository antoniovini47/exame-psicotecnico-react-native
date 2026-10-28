import React, {useEffect, useRef} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ToastAndroid,
  Modal,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import {AudioPlayer, createAudioPlayer} from 'expo-audio';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

import {styles} from './styles';
import questionsDB from '../../database/QuestionsDB';
import {Question} from '../../class/Question';

const bannerAdId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-9218769381944425/9573093376';

const interstitialAdId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9218769381944425/2459129925';

const rewardedAdId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9218769381944425/1312959273';

const keywordsAds = {
  keywords: [
    'veiculos',
    'habilitacao',
    'transito',
    'detran',
    'psicotecnico',
    'exame',
  ],
};

let showNoMoreAds = false;
let isAdBannerLoaded = false;
let interstitialAdLoadedEachQuestionFactor = __DEV__ ? 2 : 5;

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log(`Ads Initializeds - Banner Ad id: ${bannerAdId} `);
  });

const interstitialAd = InterstitialAd.createForAdRequest(
  interstitialAdId,
  keywordsAds,
);

const rewardedAd = RewardedAd.createForAdRequest(rewardedAdId, keywordsAds);

const correctSound = createAudioPlayer(require('../../../assets/sounds/correct.mp3'));
const incorrectSound = createAudioPlayer(require('../../../assets/sounds/incorrect.mp3'));

function playSound(player: AudioPlayer) {
  player.seekTo(0);
  player.play();
}

const imageDefault = require('../../../assets/icon.png');

const minimunQuantityQuestions = __DEV__ ? 3 : questionsDB.length / 2;

const showToast = (text: string) => {
  ToastAndroid.showWithGravity(text, ToastAndroid.LONG, ToastAndroid.CENTER);
};

let emptyQuestion: Question = {
  id: 0,
  textQuestion: 'Null Question',
  textOptionA: 'Alt A',
  textOptionB: 'Alt B',
  textOptionC: 'Alt C',
  textOptionD: 'Alt D',
  textOptionE: 'Alt E',
  correctOption: 'a',
  image: imageDefault,
};
let currentQuestion = 0,
  sortedQuestions: Question[] = [emptyQuestion],
  scoreCount = 0;

function sortingQuestions(quantity: number): Question[] {
  const allQuestions = [...questionsDB];
  const questionsSelected: Question[] = [];

  for (let i = 1; i <= quantity; i++) {
    let sortedNumber = Math.floor(Math.random() * allQuestions.length);
    questionsSelected.push({
      ...allQuestions[sortedNumber],
    });
    allQuestions.splice(sortedNumber, 1);
  }
  return questionsSelected;
}

export function Home() {
  const [isInterstitialAdLoaded, setIsInterstitialAdLoaded] =
    React.useState(false);
  useEffect(() => {
    const unsubscribe = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setIsInterstitialAdLoaded(true);
        __DEV__ ? showToast('Anúncio carregado') : null;
      },
    );

    showNoMoreAds;
    interstitialAd.load();
    return unsubscribe;
  }, []);

  const [isRewardedAdLoaded, setIsRewardedAdLoaded] = React.useState(false);
  useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setIsRewardedAdLoaded(true);
      },
    );
    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        showNoMoreAds = true;
        console.log(
          'User earned reward of ',
          reward,
          '. showNoMoreAds: ',
          showNoMoreAds,
        );
      },
    );

    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const [appState, setAppState] = React.useState('start');
  const [quantityQuestionsSelected, setQuantityQuestionsSelected] =
    React.useState(minimunQuantityQuestions);
  const [textButton, setTextButton] = React.useState('Iniciar');
  const [textTitle, setTextTitle] = React.useState('Exame Psicotécnico');
  const [image, setImagePath] = React.useState(
    imageDefault,
  );
  const [textQuestion, setTextQuestion] = React.useState(
    'Selecione a quantidade de questões e clique em iniciar para começar o exame.',
  );
  const [textOptionA, setTextOptionA] = React.useState('Alternativa A');
  const [textOptionB, setTextOptionB] = React.useState('Alternativa B');
  const [textOptionC, setTextOptionC] = React.useState('Alternativa C');
  const [textOptionD, setTextOptionD] = React.useState('Alternativa D');
  const [textOptionE, setTextOptionE] = React.useState('Alternativa E');
  const [optionSelected, setOptionSelected] = React.useState('');
  const [isModalConfigsVisible, setModalConfigsVisible] = React.useState(false);

  useEffect(() => {
    console.log('-----------Log Tela atual-----------');
    console.log(`Estado atual: ${appState.toString()}`);
    console.log(`Questão atual: ${currentQuestion}`);
  }, [currentQuestion]);

  function mountNextQuestion() {
    currentQuestion++;
    setTextTitle(`Questão ${currentQuestion}/${quantityQuestionsSelected}`);
    setOptionSelected(__DEV__ ? 'b' : '');
    setImagePath(sortedQuestions[currentQuestion].image);
    setTextQuestion(sortedQuestions[currentQuestion].textQuestion);
    setTextOptionA(sortedQuestions[currentQuestion].textOptionA);
    setTextOptionB(sortedQuestions[currentQuestion].textOptionB);
    setTextOptionC(sortedQuestions[currentQuestion].textOptionC);
    setTextOptionD(sortedQuestions[currentQuestion].textOptionD);
    setTextOptionE(sortedQuestions[currentQuestion].textOptionE);
    if (
      currentQuestion % interstitialAdLoadedEachQuestionFactor == 0 &&
      isInterstitialAdLoaded &&
      !showNoMoreAds
    ) {
      interstitialAd.show();
      interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        setIsInterstitialAdLoaded(false);
        interstitialAd.load();
      });
    }
  }

  const handleMainButtonClicked = () => {
    if (appState === 'result') {
      setAppState('start');
      setTextButton('Iniciar');
      setTextTitle('Exame Psicotécnico');
      setTextQuestion(
        'Selecione a quantidade de questões e clique em iniciar para começar o exame.',
      );
      sortedQuestions = [emptyQuestion];
      currentQuestion = 0;
      scoreCount = 0;
      return;
    }

    if (appState === 'paused') {
      setAppState('question');
      setTextButton('Responder');

      if (currentQuestion == quantityQuestionsSelected) {
        setImagePath(imageDefault);
        setAppState('result');
        setTextButton('Repetir');
        setTextTitle('Resultado');
        setTextQuestion(
          `Sua pontuação foi: ${scoreCount}/${quantityQuestionsSelected}`,
        );
        return;
      }

      mountNextQuestion();
      return;
    }

    if (appState === 'question') {
      if (optionSelected == undefined || optionSelected == '') {
        showToast('Por favor, selecione uma opção');
        return;
      }

      if (optionSelected == sortedQuestions[currentQuestion].correctOption) {
        playSound(correctSound);
        scoreCount++;
      } else {
        playSound(incorrectSound);
      }

      setTextButton('Continuar');
      setAppState('paused');
      return;
    }

    if (appState === 'start') {
      async function loadQuestions() {
        sortedQuestions = sortedQuestions.concat(
          sortingQuestions(quantityQuestionsSelected),
        );
        mountNextQuestion();
      }

      loadQuestions();
      setAppState('question');
      setTextButton('Responder');
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.textTitle}>{textTitle}</Text>
      </View>
      <View style={styles.image}>
        <Image source={image} />
      </View>
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.textContent}>{textQuestion}</Text>
          {appState === 'start' && (
            <View>
              <Slider
                style={styles.slider}
                minimumValue={minimunQuantityQuestions}
                maximumValue={questionsDB.length}
                value={(questionsDB.length * 4) / 5}
                step={1}
                onValueChange={value => setQuantityQuestionsSelected(value)}
              />

              <Text style={styles.textContent}>
                Quantidade de questões: {quantityQuestionsSelected}
              </Text>
            </View>
          )}
          <View>
            {(appState === 'question' || appState == 'paused') && (
              <RadioButton.Group
                onValueChange={newOptionSelected =>
                  setOptionSelected(newOptionSelected)
                }
                value={optionSelected}>
                <TouchableWithoutFeedback
                  onPress={() => setOptionSelected('a')}>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        backgroundColor:
                          appState === 'paused'
                            ? sortedQuestions[currentQuestion].correctOption ===
                              'a'
                              ? 'green'
                              : 'red'
                            : 'black',
                      },
                    ]}>
                    <RadioButton value="a" disabled={appState === 'paused'} />
                    <Text style={styles.textOption}>{textOptionA}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setOptionSelected('b')}>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        backgroundColor:
                          appState === 'paused'
                            ? sortedQuestions[currentQuestion].correctOption ===
                              'b'
                              ? 'green'
                              : 'red'
                            : 'black',
                      },
                    ]}>
                    <RadioButton value="b" disabled={appState === 'paused'} />
                    <Text style={styles.textOption}>{textOptionB}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setOptionSelected('c')}>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        backgroundColor:
                          appState === 'paused'
                            ? sortedQuestions[currentQuestion].correctOption ===
                              'c'
                              ? 'green'
                              : 'red'
                            : 'black',
                      },
                    ]}>
                    <RadioButton value="c" disabled={appState === 'paused'} />
                    <Text style={styles.textOption}>{textOptionC}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setOptionSelected('d')}>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        backgroundColor:
                          appState === 'paused'
                            ? sortedQuestions[currentQuestion].correctOption ===
                              'd'
                              ? 'green'
                              : 'red'
                            : 'black',
                      },
                    ]}>
                    <RadioButton value="d" disabled={appState === 'paused'} />
                    <Text style={styles.textOption}>{textOptionD}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setOptionSelected('e')}>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        backgroundColor:
                          appState === 'paused'
                            ? sortedQuestions[currentQuestion].correctOption ===
                              'e'
                              ? 'green'
                              : 'red'
                            : 'black',
                      },
                    ]}>
                    <RadioButton value="e" disabled={appState === 'paused'} />
                    <Text style={styles.textOption}>{textOptionE}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </RadioButton.Group>
            )}
          </View>
        </ScrollView>
      </View>
      <View style={styles.adBanner}>
        {!isAdBannerLoaded && (
          <Text style={styles.textAdBanner}>
            Carregando anúncios. Para remover anúncios clique no botão de
            configurações.
          </Text>
        )}
        <View style={{display: isAdBannerLoaded ? 'flex' : 'none'}}>
          <BannerAd
            unitId={bannerAdId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            onAdLoaded={() => {
              console.log(
                `isAdBannerLoaded ficou true, pelo loaded, result: ${isAdBannerLoaded}`,
              );
              isAdBannerLoaded = true;
            }}
            onAdFailedToLoad={() => {
              console.log(
                `isAdBannerLoaded ficou false, pelo failed, result: ${isAdBannerLoaded}`,
              );
              isAdBannerLoaded = false;
            }}
            onAdClosed={() => {
              console.log(
                `isAdBannerLoaded ficou false, pelo closed, result: ${isAdBannerLoaded}`,
              );
              isAdBannerLoaded = false;
            }}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setModalConfigsVisible(!isModalConfigsVisible)}
          style={styles.mainButton}>
          <Image
            style={styles.imageButtonConfig}
            source={require('../../icons/gear.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleMainButtonClicked}
          style={styles.mainButton}>
          <Text style={styles.textButton}>{textButton}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalConfigsVisible}
        onRequestClose={() => {
          setModalConfigsVisible(!isModalConfigsVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>SOBRE</Text>
            <Text style={styles.modalText}>
              Simulado para prática do Teste psicotécnico comumente aplicado na
              avaliação para obtenção de Carteira de Habilitação.
            </Text>
            <Text style={styles.modalText}>
              Você pode nos enviar o feedback e deixar sua avaliação geral sobre
              o app na própria play store.
            </Text>
            <Text style={styles.modalText}>
              Para remoção dos anúncios que aparecem em tela inteira, você pode
              assistir a um único anúncio clicando em "Remover anúncios" abaixo.
              Após isso, serão desabilitados os demais anúncios.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={[styles.modalButton, {marginRight: 50}]}
                onPress={() => setModalConfigsVisible(!isModalConfigsVisible)}>
                <Text style={{color: 'white'}}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {display: !showNoMoreAds ? 'flex' : 'none'},
                ]}
                onPress={() =>
                  isRewardedAdLoaded
                    ? rewardedAd.show()
                    : showToast('Falha ao carregar anúncio.')
                }>
                <Text style={{color: 'white'}}>Remover Anúncios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
