'use strict';

import React from 'react-native';
import {Provider} from 'react-redux';
import Router from './Router';
import codePush from 'react-native-code-push';

import store from './store';
import HttpCache from './store/HttpCache';
import storage from './store/storage';
import {setSelectedRestaurants, getAreas, setSelectedFavorites, getRestaurants, updateLocation} from './store/actions';

const {AppState} = React;

export default class Main extends React.Component {
   componentDidMount() {
      codePush.sync();
      
      AppState.addEventListener('change', currentAppState => {
         if (currentAppState === 'active') {
            this.refresh();
            this.startAutoUpdate();
         } else if (currentAppState === 'background' && this.updateInterval) {
            this.stopAutoUpdate();
         }
      });

      // populate selected restaurants and favorites
      storage.getList('selectedRestaurants').then(_ => store.dispatch(setSelectedRestaurants(_)));
      storage.getList('selectedFavorites').then(_ => store.dispatch(setSelectedFavorites(_)));

      // get areas
      store.dispatch(getAreas());

      // update restaurants if selected restaurants have changed
      let previousSelected;
      store.subscribe(() => {
         const selected = store.getState().selectedRestaurants;
         if (selected !== previousSelected) {
            HttpCache.reset('menus');
            previousSelected = selected;
            store.dispatch(getRestaurants(selected));
         }
      });

      this.refresh();
      this.startAutoUpdate();
   }
   componentWillUnmount() {
      this.stopAutoUpdate();
   }
   startAutoUpdate() {
      if (!this.updateInterval)
         this.updateInterval = setInterval(() => this.refresh(), 15000);
   }
   stopAutoUpdate() {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
   }
   refresh() {
      store.dispatch({type: 'UPDATE_NOW'});
      store.dispatch(updateLocation());
   }
   render() {
      return (
         <Provider store={store}>
            <Router />
         </Provider>
      );
   };
}

export default Main;
