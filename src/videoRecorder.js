import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';

const App = ({ navigation }) => {
    const cameraRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [videoUri, setVideoUri] = useState(null);
    const [timer, setTimer] = useState(0);
    const [timerId, setTimerId] = useState(null);

    const startRecording = async () => {
        setIsRecording(true);
        setTimer(0);
        const newTimerId = setInterval(() => setTimer(prevTimer => prevTimer + 1), 1000);
        setTimerId(newTimerId);
        const options = { quality: RNCamera.Constants.VideoQuality["720p"] };
        const data = await cameraRef.current.recordAsync(options);
        setVideoUri(data.uri);
        clearInterval(newTimerId);
        setTimerId(null);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setIsPaused(false);
        clearInterval(timerId);
        setTimerId(null);
        await cameraRef.current.stopRecording();
    };

    const pauseRecording = () => {
        setIsPaused(true);
        clearInterval(timerId);
        setTimerId(null);
    };

    const resumeRecording = () => {
        setIsPaused(false);
        const newTimerId = setInterval(() => setTimer(prevTimer => prevTimer + 1), 1000);
        setTimerId(newTimerId);
    };

    const playVideo = () => {
        // Code for playing the recorded video
        if (videoUri) {
            navigation.navigate("videoplayer", { video_url: videoUri })
            // Use a video player library or built-in components to play the video
            // For example, you can use the `react-native-video` library
        }
    };

    const retakeVideo = () => {
        setIsRecording(false);
        setIsPaused(false);
        setVideoUri(null);
        clearInterval(timerId);
        setTimerId(null);
    };

    return (
        <View style={{ flex: 1 }}>
            <RNCamera
                ref={cameraRef}
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                autoFocus={RNCamera.Constants.AutoFocus.on}
            />

            {isRecording && (
                <View style={{ position: 'absolute', top: 20, right: 20 }}>
                    <Text style={{ color: 'white' }}>Recording: {timer}s</Text>
                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                {videoUri ? (
                    <TouchableOpacity onPress={playVideo}>
                        <Text style={{ fontSize: 18, color: 'blue' }}>Play Video</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        {!isRecording && (
                            <TouchableOpacity onPress={isPaused ? resumeRecording : startRecording}>
                                <Text style={{ fontSize: 18, color: 'green' }}>
                                    {isPaused ? 'Resume' : 'Record'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        {isRecording && (
                            <>
                                {!isPaused ? (
                                    <TouchableOpacity onPress={pauseRecording}>
                                        <Text style={{ fontSize: 18, color: 'orange', marginLeft: 20 }}>Pause</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={resumeRecording}>
                                            <Text style={{ fontSize: 18, color: 'green', marginLeft: 20 }}>Resume</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={stopRecording}>
                                            <Text style={{ fontSize: 18, color: 'red', marginLeft: 20 }}>Stop</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

                {videoUri && (
                    <TouchableOpacity onPress={retakeVideo}>
                        <Text style={{ fontSize: 18, color: 'blue', marginLeft: 20 }}>Retake</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default App;
