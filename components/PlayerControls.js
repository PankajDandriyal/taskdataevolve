import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackIcon from '../assets/back_white.svg';
import BackwordIcon from '../assets/backward.svg';
import ForwardIcon from '../assets/forward.svg';
import PauseIcon from '../assets/pause.svg';
import RotateIcon from '../assets/rotate.svg';
import CastIcon from '../assets/screening.svg';
import PlayIcon from '../assets/videoPlay.svg';
import { COLORS, } from '../src/utils/theme';


export const PlayerControls = ({
  navigation,
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
  fullScreen,
  handleFullScreen,
  handleBack,
  title

}) => (
  <>
    <View style={{ position: 'absolute', flexDirection: 'row', width: "100%", marginTop: Platform.OS === 'ios' ? fullScreen == true ? '2%' : '13%' : '2%' }}>
      <View style={{ left: 0, flexDirection: 'row', alignItems: 'center', marginStart: 20, flex: 1 }}>
        <TouchableOpacity onPress={handleBack} style={{ zIndex: 100, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }} >
          <BackIcon />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: COLORS.WHITE, marginLeft: 23, padding: 5 }} numberOfLines={1}>{title}</Text>
      </View>
      <View style={{ right: 0, flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ marginEnd: 23 }} onPress={handleFullScreen}>
          <RotateIcon />
        </TouchableOpacity>
        <View style={{ marginRight: 20 }}>
          <CastIcon />
        </View>
      </View>
    </View>
    <View style={styles.wrapper}>
      {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
          <BackwordIcon />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.touchable}
        onPress={playing ? onPause : onPlay}>
        {playing ? <PlayIcon /> : <PauseIcon />}
      </TouchableOpacity>

      {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
          <ForwardIcon />
        </TouchableOpacity>
      )}

    </View>
  </>
)



const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,

  },
  touchable: {
    padding: 10,
    paddingBottom: 0
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});
