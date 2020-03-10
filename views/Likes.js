import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const Likes = (props) => {
  const {navigation} = props;
  return (
    <List navigation={navigation} mode={'likes'}></List>
  );
};

Likes.propTypes = {
  navigation: PropTypes.object,
};

export default Likes;