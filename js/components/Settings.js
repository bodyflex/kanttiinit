// @flow
import React from 'react';
import Loader from './reusable/Loader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import sortBy from 'lodash/sortBy';

import {setLang} from '../store/actions/preferences';
import {selectLang} from '../store/selectors';
import Area from './Area';
import Dropdown from './reusable/Dropdown';
import ContactForm from './reusable/ContactForm';
import {colors, spaces, defaultStyles} from '../utils/style';
import translations from '../utils/i18n';

const Settings = ({setLang, lang, areas, loading}) => (
  <ScrollView style={styles.container}>
    <View style={[styles.settingGroup, {zIndex: 999}]}>
      <Text style={defaultStyles.bigText}>{translations.lang[lang]}</Text>
      <Dropdown
        value={lang}
        options={[{value: 'fi', label: 'Finnish'}, {value: 'en', label: 'English'}]}
        selected={lang}
        onSelect={value => setLang(value)} />
    </View>
    <View style={styles.settingGroup}>
      <Text style={defaultStyles.bigText}>{translations.restaurants[lang]}</Text>
      {loading || !areas ? <View style={{height: 100}}><Loader color={colors.accent}/></View> :
      sortBy(areas, 'name').map(area => <Area key={area.id} area={area} />)}
      <ContactForm
        type="missing-restaurant"
        style={{marginVertical: spaces.medium}}
        label={translations.whichRestaurantIsMissing[lang] }/>
    </View>
    <View style={[styles.settingGroup, {marginBottom: 300}]}>
      <Text style={defaultStyles.bigText}>{translations.feedback[lang]}</Text>
      <ContactForm
        type="random-feedback"
        style={{marginVertical: spaces.medium}}
        label={translations.additionalFeedback[lang] }/>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey
  },
  settingGroup: {
    padding: spaces.medium,
    marginTop: spaces.big,
    backgroundColor: colors.white
  },
  settingLabel: {
    color: colors.darkGrey,
    marginVertical: spaces.small
  }
});

const mapState = state => ({
  areas: state.data.areas,
  loading: state.pending.areas,
  lang: selectLang(state)
});

const mapDispatch = dispatch => bindActionCreators({setLang}, dispatch);

export default connect(mapState, mapDispatch)(Settings);
