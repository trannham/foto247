/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from "react";
import {
  List as BaseList, Spinner
} from 'native-base';
import ListItem from "./ListItem";
import {MediaContext} from "../contexts/MediaContext";
import {getAllMedia, getFavoriteMedia, getUserMedia} from "../hooks/APIHooks";
import PropTypes from "prop-types";
import {AsyncStorage, StyleSheet} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import Title from "./Title";
import {View, Text} from 'react-native';
import { fetchGET } from '../hooks/APIHooks';

const List = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname]= useState(null);
  //Get keySearch from Search page
  const keySearch = props.keySearch;
  const getMedia = async (mode) => {
    try {
      console.log('mode', mode);
      //Get userID, userName
      const userFromStorage = await AsyncStorage.getItem("user");
      const userID = JSON.parse(userFromStorage).user_id;
      const fullname= JSON.parse(userFromStorage).fullname? `, ${JSON.parse(userFromStorage).fullname}!`:'!';
      setFullname(fullname);
      //Get Media
      const allData = await getAllMedia();
      const token = await AsyncStorage.getItem('userToken');
      const myData = await getUserMedia(token);
      const favouriteMedia = await getFavoriteMedia(token);
      setMedia({
        allFiles: allData.reverse(),
        favouriteMedia: favouriteMedia,
        myFiles: myData,
      });
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getMedia(props.mode);
  }, []);

  let searchList;
  if (props.mode === "search") {
    searchList = media.allFiles.filter(item => (item.description.toUpperCase()).includes(keySearch.toUpperCase()));
  }

  return (
    <View>
      {loading ? (
        <Spinner/>
      ) : (
        <>
          {props.mode === 'all' &&
          <ScrollView>
            <View style={styles.wrapContainer}>
              {media.allFiles.map((item, index) => (
                <ListItem
                  key={index}
                  navigation={props.navigation}
                  singleMedia={item}
                  mode={props.mode}
                  getMedia={getMedia}
                />
              ))}
            </View>
          </ScrollView>
          }
          {props.mode === 'myfiles' &&
          <BaseList
            dataArray={media.myFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItem
              navigation={props.navigation}
              singleMedia={item}
              mode={props.mode}
              getMedia={getMedia}
            />}
          />
          }
          {props.mode === 'likes' &&
            <ScrollView>
              <Title subtitle={media.favouriteMedia.length > 0 ? null : "You didn't like anything!"} count={media.favouriteMedia.length > 0 ? media.favouriteMedia.length : null} />
              {media.favouriteMedia.length > 1}
              <View style={styles.wrapContainer}>
                {media.allFiles.map((item, index) => (
                  <ListItem
                    key={index}
                    navigation={props.navigation}
                    singleMedia={item}
                    mode={props.mode}
                    getMedia={getMedia}
                  />
                ))}
              </View>
            </ScrollView>
          }
          {props.mode === "search" && (
            <ScrollView>
              <Title title={`Related to "${keySearch}" :`} subtitle={searchList.length > 0 ? null : "There nothing match your search!"} count={searchList.length > 0 ? searchList.length : null} />
              {searchList.length > 1 && <Sort setOption={setOption} />}
              <View style={styles.columnContainer}>
                {media.allFiles.map((item, index) => (
                  <ListItem
                    key={index}
                    navigation={props.navigation}
                    singleMedia={item}
                    mode={props.mode}
                    getMedia={getMedia}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 75,
    justifyContent: "space-between",
  },
  columnContainer: {
    marginHorizontal: 20,
    marginBottom: 75,
  }
});

List.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string,
};

export default List;
