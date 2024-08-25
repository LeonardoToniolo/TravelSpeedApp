import { StyleSheet, TextInput, Button, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Index() {
  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>('');
  const [time, setTime] = useState<any>('');
  const [averageSpeed, setAverageSpeed] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const calculateSpeed = () => {
    // Aqui você pode adicionar lógica para calcular a distância entre a localização atual e o destino.
    // Em seguida, calcular a velocidade média necessária.
    // Este é apenas um exemplo.
    const distance = 10; // exemplo de distância em km
    const timeInHours = time / 60; // converter tempo em horas
    const speed = distance / timeInHours;
    setAverageSpeed(speed);
  };

  return (
    <View
      style={styles.container}
    >

      {location && (
        <MapView
        //   style={styles.map}
        //   initialRegion={{
        //     latitude: location.latitude,
        //     longitude: location.longitude,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        //   }}
        >
          {/* <Marker coordinate={location} title="Você está aqui" /> */}
        </MapView>
      )}
      <TextInput
        style={styles.input}
        placeholder="Endereço de destino"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Tempo em minutos"
        value={time}
        onChangeText={setTime}
        keyboardType="numeric"
      />

      <Button title="Calcular Velocidade Média" onPress={calculateSpeed} />
      {averageSpeed && (
        <Text style={styles.text}>Velocidade Média: {averageSpeed.toFixed(2)} km/h</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});
