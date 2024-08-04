// VideoList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import RNFS from 'react-native-fs';
import { createThumbnail } from 'react-native-create-thumbnail';

export default function VideoList({ route,navigation }) {
  const { folderPath } = route.params;
  const [videos, setVideos] = useState([]);
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    const loadVideos = async () => {
      const files = await RNFS.readDir(folderPath);
      const videoFiles = files.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.avi')); // Add more extensions if needed
      setVideos(videoFiles);
      await generateThumbnails(videoFiles);
    };

    loadVideos();
  }, [folderPath]);

  const generateThumbnails = async (videoFiles) => {
    const thumbnailPromises = videoFiles.map(async (file) => {
      try {
        const { uri } = await createThumbnail({ url: file.path, timeStamp: 0 });
        return { path: file.path, thumbnail: uri };
      } catch (error) {
        console.log(`Error generating thumbnail for ${file.path}: `, error);
        return { path: file.path, thumbnail: null };
      }
    });

    const thumbnailData = await Promise.all(thumbnailPromises);
    const thumbnailMap = thumbnailData.reduce((acc, { path, thumbnail }) => {
      acc[path] = thumbnail;
      return acc;
    }, {});

    setThumbnails(thumbnailMap);
  };

  console.log(videos,"==")

  const renderItem = ({ item }) => (
    <Pressable onPress={()=>navigation.navigate("videoplayer",{video_url:item?.path})} style={styles.itemContainer}>
      {thumbnails[item.path] ? (
        <Image source={{ uri: thumbnails[item.path] }} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnail} />
      )}
      <Text style={styles.videoName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.path}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  videoName: {
    fontSize: 16,
    color: '#000',
  },
});
