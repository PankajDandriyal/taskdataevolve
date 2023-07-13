import React from "react";
import VideoRecorder from "./src/videoRecorder";
import { NavigationContainer } from '@react-navigation/native';
import { VideoPlayer } from "./src/videoPlayer";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="videorecorder" component={VideoRecorder} />
        <Stack.Screen name="videoplayer" component={VideoPlayer} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}

export default App;
