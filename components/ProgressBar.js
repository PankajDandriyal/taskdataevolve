import React, { useEffect, useState } from 'react';
// import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet, Image } from 'react-native';
import Slider from "react-native-slider";

export const ProgressBar = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
}) => {
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);
  const [icon, setIcon] = useState();



  return (

    <View style={styles.wrapper}>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeLeft}>{position}</Text>
        <Text style={styles.timeRight}>{fullDuration}</Text>
      </View>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={'#D9D9D9'}
        maximumTrackTintColor={'rgba(255, 255, 255, 0.3)'}
        thumbTintColor={'#D9D9D9'}
        style={{ marginHorizontal: 10 }}

      />

    </View>
  );

  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds
      }`;
  }

  function handleOnSlide(time) {
    onSlideCapture({ seekTime: time });
  }
};

const styles = StyleSheet.create({
  wrapper: {
    bottom: 20,
    paddingHorizontal: 10
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});
