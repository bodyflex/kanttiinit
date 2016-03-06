'use strict';

import React from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import Course from './Course';
import {colors, defaultStyles} from '../../../style';

import Button from '../../Button';
import RestaurantDialog from '../Restaurants/RestaurantDialog';
import {showModal} from '../../../store/actions';

const {
   View,
   Text,
   StyleSheet,
   Platform
} = React;

export class Restaurant extends React.Component {
   formatOpeningHours() {
      const {restaurant, date} = this.props;
      if (restaurant.hours) {
         const h = restaurant.hours;
         return String(h[0]).substr(0, 2) + ':' + String(h[0]).substr(2) + ' - ' + String(h[1]).substr(0, 2) + ':' + String(h[1]).substr(2);
      }
      return 'suljettu';
   }
   static formatDistance(distance) {
      return distance < 1000 ? distance.toFixed(0) + ' m' : (distance / 1000).toFixed(1) + ' km';
   }
   getFavString(restaurant) {
      return restaurant.courses.map(c => +c.isFavorite).join('');
   }
   shouldComponentUpdate(props) {
      const result = props.restaurant.id !== this.props.restaurant.id
         || props.restaurant.isOpen !== this.props.restaurant.isOpen
         || props.restaurant.distance !== this.props.restaurant.distance
         || this.getFavString(props.restaurant) !== this.getFavString(this.props.restaurant);

      return result;
   }
   render() {
      const {date, now, restaurant, showModal} = this.props;
      const courses = restaurant.courses;
      const isToday = now.isSame(date, 'day');
      return (
         <View style={[defaultStyles.card, styles.container]}>

            <Button
               onPress={() => showModal(<RestaurantDialog restaurant={restaurant} />)}
               style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}
               containerStyle={[styles.header, isToday && restaurant.isOpen && {backgroundColor: colors.accent}]}>
               <View>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  {restaurant.distance ?
                  <View style={styles.distance}>
                     <Icon style={styles.distanceText} name="ios-location" />
                     <Text style={[styles.distanceText, {marginLeft: 3}]}>{Restaurant.formatDistance(restaurant.distance)}</Text>
                  </View>
                  : null}
               </View>
               <View style={{flex: 1}}>
                  <Text style={[styles.openingHours, restaurant.hours && styles.openingHoursAvailable]}>
                     {this.formatOpeningHours()}
                  </Text>
               </View>
            </Button>

            {!courses.length ?
            <View style={{padding: 10, borderRadius: 2}}>
               <Text style={styles.emptyMenuText}>Ei menua saatavilla.</Text>
            </View>
            : courses.map((course, i) =>
            <Course
               key={i}
               course={course}
               restaurant={restaurant}
               style={[i > 0 && styles.borderTop]} />
            )}

         </View>
      );
   }
}

export default connect(
   state => ({
      now: state.now
   }),
   dispatch => ({
      showModal: c => dispatch(showModal(c, {padding: 0}))
   })
)(Restaurant);

const styles = StyleSheet.create({
   container: {
      borderWidth: 0,
      marginLeft: 14,
      marginRight: 14,
      marginBottom: 14,
      paddingBottom: 0,
      elevation: 2,
      borderRadius: 2
   },
   header: {
      backgroundColor: '#7c7c7c',
      padding: 6,
      borderRadius: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
   },
   borderTop: {
      borderTopWidth: 1,
      borderTopColor: '#eee'
   },
   emptyMenuText: {
      color: colors.grey,
      fontSize: 12,
      textAlign: 'center'
   },
   openingHours: {
      textAlign: 'right',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 12
   },
   openingHoursAvailable: {
      color: '#fff'
   },
   distance: {
      flexDirection: 'row',
      height: 16,
      alignItems: 'center'
   },
   distanceText: {
      color: colors.lightGrey,
      fontSize: 10
   },
   restaurantName: {
      fontSize: 14,
      color: '#fff'
   }
});
