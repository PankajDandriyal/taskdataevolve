// FolderList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';

export default function FolderList({ navigation }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestStoragePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to read videos',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            loadFolders();
          } else {
            console.log('Storage permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        loadFolders();
      }
    };

    requestStoragePermission();
  }, []);

  const loadFolders = async () => {
    const path = Platform.OS === 'android' ? RNFS.ExternalStorageDirectoryPath : RNFS.DocumentDirectoryPath;
    const folderData = await scanDirectory(path);
    setFolders(folderData);
    setLoading(false);
  };

  const scanDirectory = async (dirPath) => {
    let folderData = [];
    try {
      const files = await RNFS.readDir(dirPath);

      for (const file of files) {
        if (file.isDirectory()) {
          try {
            const subFiles = await RNFS.readDir(file.path);
            const videoFiles = subFiles.filter(subFile => subFile.name.endsWith('.mp4') || subFile.name.endsWith('.mkv') || subFile.name.endsWith('.avi')); // Add more extensions if needed
            
            if (videoFiles.length > 0) {
              folderData.push({ id: file.path, name: file.name, videoCount: videoFiles.length });
            }
            
            // Recursively scan subdirectories
            const subFolderData = await scanDirectory(file.path);
            folderData = folderData.concat(subFolderData);
          } catch (subFileError) {
            console.log(`Error reading directory ${file.path}: `, subFileError);
          }
        }
      }

      // Include specific video folders if not found during recursive scan
      const commonVideoFolders = [
        `${dirPath}/WhatsApp/Media/WhatsApp Video`,
      ];
      
      for (const commonFolder of commonVideoFolders) {
        try {
          const exists = await RNFS.exists(commonFolder);
          if (exists) {
            const videos = await RNFS.readDir(commonFolder);
            const videoFiles = videos.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.avi')); // Add more extensions if needed
            if (videoFiles.length > 0) {
              const alreadyIncluded = folderData.some(folder => folder.id === commonFolder);
              if (!alreadyIncluded) {
                folderData.push({ id: commonFolder, name: commonFolder.split('/').pop(), videoCount: videoFiles.length });
              }
            }
            
            // Recursively scan subdirectories within WhatsApp Video folder
            const subFolderData = await scanDirectory(commonFolder);
            folderData = folderData.concat(subFolderData);
          }
        } catch (commonFolderError) {
          console.log(`Error reading common directory ${commonFolder}: `, commonFolderError);
        }
      }
    } catch (error) {
      console.log(`Error reading directory ${dirPath}: `, error);
    }
    return folderData;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('videoList', { folderPath: item.id })}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text>{item.name} ({item.videoCount} videos)</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
