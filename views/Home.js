import React from 'react';
import List from '../components/List';
import SearchBar from "../components/SearchBar";
import PropTypes from 'prop-types';

const Home = (props) => {
  // console.log('Home', props);
  const {navigation} = props;
  return (
    <>
    <SearchBar navigation={navigation} />
    <List navigation={navigation} mode={'all'}></List>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
