import React from 'react-native';

const {
   AsyncStorage
} = React;

export default {
   addFavorite(name) {
      console.log("add favorite " + name);
   },
   getFavorites() {
      var arr = [{name:'Spagetti'}, {name:'Pizza'}, {name: 'Tortillat'}];
      console.log("returning favs: " + arr);
      return arr;
   }
};
