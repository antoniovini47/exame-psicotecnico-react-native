import {StyleSheet, Dimensions} from 'react-native';

const paddingDefault = 10;
const paddingSmall = 5;

const fontSizeBig = 36;
const fontSizeMedium = 24;
const fontSizeSmall = 18;

const backgroundColor = 'black';
const textColor = 'white';

const adHeight = 50;
const buttonHeight = 50;
const screenWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
  // Layout styles
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: backgroundColor,
    paddingTop: paddingDefault,
    paddingBottom: paddingDefault,
  },
  header: {
    fontSize: fontSizeBig,
    color: textColor,
  },
  image: {
    width: screenWidth,
    height: (9 / 16) * screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  content: {
    flex: 5,
    padding: paddingDefault,
  },
  radioButton: {
    paddingTop: paddingSmall,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  adBanner: {
    minHeight: adHeight,
    justifyContent: 'center',
  },
  footer: {
    paddingTop: paddingDefault,
    paddingHorizontal: paddingDefault,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //Component styles
  mainButton: {
    backgroundColor: textColor,
    height: buttonHeight,
    paddingLeft: paddingSmall,
    paddingRight: paddingSmall,
  },
  imageButtonConfig: {
    height: buttonHeight,
    width: buttonHeight,
    resizeMode: 'contain',
  },
  slider: {
    backgroundColor: backgroundColor,
    paddingTop: paddingDefault,
    height: buttonHeight,
  },

  // Text styles
  textTitle: {
    color: textColor,
    fontSize: fontSizeBig,
    textAlign: 'center',
  },
  textContent: {
    color: textColor,
    fontSize: fontSizeMedium,
    textAlign: 'center',
    paddingBottom: paddingDefault,
  },
  textOption: {
    color: textColor,
    fontSize: fontSizeSmall,
  },
  textAdBanner: {
    color: 'darkgray',
    fontSize: fontSizeSmall,
    textAlign: 'center',
  },
  textButton: {
    color: backgroundColor,
    fontSize: fontSizeBig,
    textAlign: 'center',
  },

  //Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: textColor,
    borderColor: backgroundColor,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: backgroundColor,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor,
    color: textColor,
    padding: paddingDefault,
  },
});
