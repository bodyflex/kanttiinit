import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {addFavorite, removeFavorite} from '../../../store/actions/favorites';

import Button from '../../Button';

import {
   View,
   Text,
   StyleSheet,
   Platform
} from 'react-native';

class Favorite extends React.Component {
   shouldComponentUpdate(props) {
      return props.favorite.name !== this.props.favorite.name
         || props.favorite.selected !== this.props.favorite.selected;
   }
   toggle() {
      const {favorite, addFavorite, removeFavorite} = this.props;

      if (favorite.selected)
         removeFavorite(favorite.id);
      else
         addFavorite(favorite.id);
   }
   render() {
      const {favorite, addFavorite, removeFavorite} = this.props;
      console.log(this.props);
      return (
         <Button
            style={styles.favorite}
            onPress={this.toggle.bind(this)}>
            <Icon
               style={styles.heartIcon}
               color={favorite.selected ? '#fc5151' : '#999'}
               name={'md-heart' + (favorite.selected ? '' : '-outline')} />
            <Text style={styles.foodTitle}>{favorite.name}</Text>
         </Button>
      );
   }
}

const mapDispatch = dispatch => bindActionCreators({addFavorite, removeFavorite}, dispatch);

export default connect(null, mapDispatch)(Favorite);

const styles = StyleSheet.create({
   favorite: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      paddingLeft: 15,
      paddingVertical: 10,
      marginBottom: 2
   },
   heartIcon: {
      fontSize: 26
   },
   foodTitle: {
      fontWeight: '300',
      fontSize: 20,
      marginLeft: 15,
      flex: 1,
      fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined
   }
});
