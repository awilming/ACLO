import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Achievements() {
  return (
    <View style={styles.container}>
      <ScrollView indicatorStyle='white'>
        <Text style={{color: 'white', fontSize: 25}} >This screen is still in development</Text>
      </ScrollView>
    </View>
  )
}

Achievements.navigationOptions = {
  title: 'Achievements',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});