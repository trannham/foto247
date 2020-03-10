import React, { useContext, useEffect, useState } from 'react';
import { Button, Icon, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import { AsyncStorage, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { mediaURL } from '../constants/urlConst';
import { Video } from 'expo-av';
import { fetchDELETE, fetchGET, fetchPOST, getFavoriteMedia } from '../hooks/APIHooks';
import { MediaContext } from "../contexts/MediaContext";

const deviceHeight = Dimensions.get('window').height;

const Post = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [user, setUser] = useState({});
  const [saved, setSaved] = useState(undefined);
  const {navigation} = props;
  const file = navigation.state.params.file;
  // get the description object of media file


  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      setUser(json);
    } catch (e) {
      console.log('getUser error', e);
    }
  };

  const checkSaved = async () => {
    try {
      const savedLists = await fetchGET('favourites/file', file.file_id);
      savedLists.filter(item => item.user_id === file.user_id);
      console.log('saved', savedLists);
      if (savedLists.length !== 0) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } catch (e) {
      console.log('checkSaved error', e);
    }
  };

  const toggleSaved = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!saved) {
      try {
        const json = await fetchPOST('favourites', {file_id: file.file_id}, token);
        console.log('Save', json);
        if (json.favourite_id) {
          setSaved(true);
        }
      } catch (e) {
        console.log('saving error', e);
      }
    } else if (saved) {
      try {
        const json = await fetchDELETE('favourites/file', file.file_id, token);
        console.log('Unsave', json);
        if (json.message.includes('deleted')) {
          setSaved(false);
        }
      } catch (e) {
        console.log('unsaving error', e);
      }
    }
    const favouriteMedia = await getFavoriteMedia(token);
    setMedia((media) => ({
      ...media,
      favouriteMedia: favouriteMedia,
    }))
  };

  useEffect(() => {
    getUser();
    checkSaved();
  }, []);

  return (
    <>
      <ScrollView style={styles.card}>
        <View>
          {file.media_type === 'image' ? (
            <AsyncImage
              style={styles.mainImageOrVideo}
              spinnerColor='#777'
              source={{uri: mediaURL + file.filename}}
            />) :
            (<Video
              source={{uri: mediaURL + file.filename}}
              resizeMode={'cover'}
              useNativeControls
              style={styles.mainImageOrVideo}
              onError={(e) => {
                console.log('video error', e);
              }}
              onLoad={(evt) => {
                console.log('onload', evt);
              }}
            />
            )
          }
          {saved !== undefined &&
            <View style={styles.saveArea}>
              <Button rounded light onPress={toggleSaved}>
                <Icon style={saved ? styles.svIcon : styles.unsvIcon} name={'heart'} />
              </Button>
            </View>}
        </View>
        <View style={styles.infoSection}>
          <View>
            <Text style={styles.titleText}>{file.title}</Text>
          </View>
          <View style={styles.ownerAndBasicInfoSection}>
            <View>
              <Text>Posted by <Text style={styles.bold}>{user.username}</Text></Text>
            </View>
          </View>
          <View style={styles.desArea}>
            <Text style={styles.descriptionTitleText}>Description:</Text>
            {file.description === '' ? <Text style={styles.italic}>No descriptions provided.</Text> : <Text style={styles.italic}>{file.description}</Text>}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 80,
    width: '100%',
    height: '100%',
  },
  mainImageOrVideo: {
    width: '100%',
    height: 2 * deviceHeight / 5,
    resizeMode: 'cover',
  },
  saveArea: {
    position: 'absolute',
    top: 30,
    right: 15,
  },
  unsvIcon: {
    color: '#000'
  },
  svIcon: {
    color: '#a83f39',
  },
  infoSection: {
    width: '100%',
    paddingHorizontal: 15,
  },
  descriptionTitleText: {
    marginBottom: 15,
    fontSize: 25,
    textDecorationLine: 'underline'
  },
  titleText: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  ownerAndBasicInfoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 75,
    flexDirection: 'row',
  },
  desArea: {
    marginBottom: 20,
  },
  bold: {fontWeight: 'bold'},
  italic: {fontStyle: "italic"},
  underline: {textDecorationLine: 'underline'}
});

Post.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Post;
