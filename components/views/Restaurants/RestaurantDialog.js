import React from 'react';
import MapView from 'react-native-maps';
import geolib from 'geolib';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import haversine from 'haversine';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Restaurant} from '../Menu/Restaurant';
import Button from '../../Button';
import {colors, defaultStyles, spaces} from '../../../style';
import {dismissModal} from '../../../store/actions/modal';

import {Platform, Linking, View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';

const dayNumberToDayOfWeek = n => moment().day(n + 1).format('ddd').toUpperCase();

function getOpeningHourString(hours) {
   return hours.reduce((open, hour, i) => {
      if (hour) {
         const existingIndex = open.findIndex(_ => _.hour === hour);
         if (existingIndex > -1)
            open[existingIndex].endDay = dayNumberToDayOfWeek(i);
         else
            open.push({startDay: dayNumberToDayOfWeek(i), hour});
      }
      return open;
   }, []);
}

function getInitialRegion(restaurant, location) {
   const center = location ? geolib.getCenter([restaurant, location]) : restaurant;
   return {
      latitude: Number(center.latitude),
      longitude: Number(center.longitude),
      latitudeDelta: Math.max(2.5 * Math.abs(center.latitude - restaurant.latitude), 0.01),
      longitudeDelta: Math.max(2.5 * Math.abs(center.longitude - restaurant.longitude), 0.01)
   };
}

function openDirections(address) {
   const encodedAddress = encodeURIComponent(address);

   if (Platform.OS === 'ios') {
      const googleMapsUri = 'comgooglemaps://?daddr=' + encodedAddress;
      const appleMapsUrl = 'http://maps.apple.com/?daddr=' + encodedAddress;

      Linking.canOpenURL(googleMapsUri)
      .then(supported => {
         if (supported)
            Linking.openURL(googleMapsUri);
         else
            Linking.openURL(appleMapsUrl);
      })
      .catch(err => console.error('An error occurred', err));
   } else {
      Linking.openURL('http://maps.google.com/?daddr=' + encodedAddress)
   }
}

const RestaurantDialog = ({restaurant, location, address, dismissModal}) => (
   <View>

      <View>
         <MapView
            ref={c => this.map = c}
            style={{height: 300, borderRadius: 2}}
            rotateEnabled={false}
            showsUserLocation={true}
            initialRegion={getInitialRegion(restaurant, location)}>
            <MapView.Marker
               title={restaurant.name}
               anchor={{x: 0.5, y: 1}}
               centerOffset={{x: 0, y: -30 / 2}}
               description={restaurant.address}
               coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude
               }}>
               <View style={{alignItems: 'center', opacity: 0.9}}>
                  <View style={styles.markerViewText}>
                     <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                        <Icon size={14} name="md-restaurant" color={colors.white} />
                     </View>
                  </View>
                  <Icon name="md-arrow-dropdown" size={22} style={{marginTop: -10}} color={colors.red} />
               </View>
            </MapView.Marker>
         </MapView>
         <View style={styles.header}>
            <TouchableWithoutFeedback
               onPress={() => this.map.animateToCoordinate({
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude
               })}>
               <View style={{flex: 1}}>
                  <Text style={[defaultStyles.bigText, {color: colors.white}]}>{restaurant.name}</Text>
                  <Text style={[defaultStyles.smallText, {color: colors.white, opacity: 0.8}]}>
                     <Icon name="md-pin" />{' '}
                     {restaurant.address + ' '}
                     {location &&
                     <Text>
                        {' '}<Icon name="md-walk" />{' '}
                        {Restaurant.formatDistance(haversine(location, restaurant))}
                     </Text>}
                  </Text>
               </View>
            </TouchableWithoutFeedback>
         </View>
      </View>

      <View style={styles.container}>

         {getOpeningHourString(restaurant.openingHours).map((_, i) =>
         <View key={i} style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: '500', width: 64}}>{_.startDay + (_.endDay ? ' – ' + _.endDay : '')}</Text>
            <Text style={{color: colors.darkGrey}}>{_.hour}</Text>
         </View>
         )}

         <View style={styles.footer}>
            <Button
               onPress={() => Linking.openURL(restaurant.url)}
               style={{marginRight: spaces.medium}}>
               <Text style={defaultStyles.lightButtonText}>
                  <Icon name="md-home" />{' '}KOTISIVUT
               </Text>
            </Button>
            {restaurant.address &&
            <Button
               onPress={() => openDirections(restaurant.address)}>
               <Text style={defaultStyles.lightButtonText}>
                  <Icon name="md-compass" />{' '}REITTIOHJEET
               </Text>
            </Button>}
            <View style={{flex: 1}} />
            <Button
               onPress={() => dismissModal()}>
               <Text style={defaultStyles.lightButtonText}>SULJE</Text>
            </Button>
         </View>

      </View>

   </View>
);

const mapState = state => ({
   location: state.misc.location
});

const mapDispatch = dispatch => bindActionCreators({dismissModal}, dispatch);

export default connect(mapState, mapDispatch)(RestaurantDialog);

const styles = StyleSheet.create({
   container: {
      padding: spaces.big
   },
   markerViewText: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.red,
      paddingHorizontal: spaces.small
   },
   header: {
      flexDirection: 'row',
      padding: spaces.medium,
      backgroundColor: 'rgba(43, 43, 43, 0.8)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
   },
   footer: {
      alignItems: 'flex-end',
      flex: 1,
      marginTop: spaces.big,
      flexDirection: 'row'
   },
   closeButtonText: {
      fontSize: 12,
      color: 'white',
      fontWeight: 'bold'
   }
});
