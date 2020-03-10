import React from 'react';
import List from '../components/List';
import {ScrollView, Text} from 'react-native';

const Search = (props) => {
  const keySearch = props.navigation.state.params.input;
  return (
    <>
      <ScrollView>
        <List keySearch={keySearch} mode={"search"} />
      </ScrollView> 
    </>
  );
};

export default Search;