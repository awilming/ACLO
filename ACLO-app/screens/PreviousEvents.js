import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PreviousEvents() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{color: 'white', fontSize: 25}} >This screen is still in development
        </Text>
      </ScrollView>
    </View>
  )
}

PreviousEvents.navigationOptions = {
  title: 'Previous events',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});