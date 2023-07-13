import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { PlayerControls } from '../components/PlayerControls';
import { ProgressBar } from '../components/ProgressBar';

export const VideoPlayer = ({ navigation, route }) => {
  const videoRef = React.createRef();
  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });

  //Change Orientation dynamically using button
  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, [Orientation]);


  useEffect(() => {
    let timer;
    if (state.showControls) {
      timer = setTimeout(() => {
        setState(prevState => ({ ...prevState, showControls: false }));
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [state.showControls]);

  //Back handler listener to modify the actions of backpress
  useEffect(() => {
    if (Platform.OS == 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }
  }, [])


  //UI
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', flex: 1 }}>
          <Video
            ref={videoRef}
            source={{
              uri: route.params.video_url,
            }}
            style={state.fullscreen ? styles.fullscreenVideo : [{ ...StyleSheet.absoluteFillObject },]}
            controls={false}
            resizeMode={'contain'}
            onLoad={onLoadEnd}
            onProgress={onProgress}
            repeat={true}
            onEnd={onEnd}
            paused={state.play}
          />
          {state.showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                onPress={handleFullscreen}
                style={styles.fullscreenButton}>
              </TouchableOpacity>
              <PlayerControls
                navigation={navigation}
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
                fullScreen={state.fullscreen}
                handleFullScreen={handleFullscreen}
                handleBack={handleBack}
                title={route.params.video_title}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

    </View>
  );

  function handleOrientation(orientation) {

    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({ ...s, fullscreen: true })), StatusBar.setHidden(true))
      : (setState(s => ({ ...s, fullscreen: false })),
        StatusBar.setHidden(false));
  }


  function handleFullscreen() {
    if (state.fullscreen) {
      Orientation.unlockAllOrientations();
      Orientation.lockToPortrait();
      setState(s => ({ ...s, fullscreen: false }));
      StatusBar.setHidden(false);
    } else {
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
      setState(s => ({ ...s, fullscreen: true }));
      StatusBar.setHidden(true);
    }
  }

  function handlePlayPause() {

    if (state.play) {
      setState({ ...state, play: false, showControls: true });
      return;
    }

    setState({ ...state, play: true });
    // setState(s => ({ ...s, showControls: false }));
  }


  //Skip backward
  function skipBackward() {
    if (state.currentTime > 0) {
      videoRef.current.seek(state.currentTime - 10);
      setState({ ...state, currentTime: state.currentTime - 10 });
    }
  }

  //Skip next
  function skipForward() {
    if (state?.currentTime <= state?.duration) {
      videoRef.current.seek(state.currentTime + 10);
      setState({ ...state, currentTime: state.currentTime + 10 });
    }
  }

  //Seek bar functionality
  function onSeek(data) {
    videoRef.current.seek(data.seekTime);
    setState({ ...state, currentTime: data.seekTime, play: true });
  }


  function onLoadEnd(data) {
    setState(s => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  function onProgress(data) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({ ...state, play: false });
    videoRef.current.seek(0);
  }

  function showControls() {
    state.showControls
      ? setState({ ...state, showControls: false })
      : setState({ ...state, showControls: true });
  }

  function handleBack() {
    Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
    setState(s => ({ ...s, fullscreen: false }));
    StatusBar.setHidden(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100)
  }
};


//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
    marginBottom: '10%',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').height,
    width: '100%',
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});
