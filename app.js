import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import calculateDistance from './utils/calculateDistance';
import Timer from './components/Timer';

const App = () => {
    const [destination, setDestination] = useState('');
    const [time, setTime] = useState(30); // Tempo desejado em minutos
    const [distance, setDistance] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [neededSpeed, setNeededSpeed] = useState(0);
    const [timer, setTimer] = useState(0);
    const [status, setStatus] = useState('neutral'); // 'neutral', 'above', 'below'
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.log(error),
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        if (neededSpeed > 0) {
            const watchId = Geolocation.watchPosition(
                (position) => {
                    const currentSpeed = position.coords.speed * 3.6; // Convertendo m/s para km/h
                    setCurrentSpeed(currentSpeed);

                    if (currentSpeed > neededSpeed) {
                        setTimer((prev) => prev + 1);
                        setStatus('above');
                    } else {
                        setTimer((prev) => prev - 1);
                        setStatus('below');
                    }
                },
                (error) => console.log(error),
                { enableHighAccuracy: true, distanceFilter: 1 }
            );

            return () => Geolocation.clearWatch(watchId);
        }
    }, [neededSpeed]);

    const handleCalculateSpeed = async () => {
        const calculatedDistance = await calculateDistance(userLocation, destination);
        setDistance(calculatedDistance);
        const calculatedSpeed = (calculatedDistance / (time / 60)); // em km/h
        setNeededSpeed(calculatedSpeed);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Endereço de destino"
                onChangeText={setDestination}
                style={styles.input}
            />
            <TextInput
                placeholder="Tempo desejado (minutos)"
                onChangeText={(text) => setTime(parseFloat(text))}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Calcular Velocidade" onPress={handleCalculateSpeed} />
            <View style={styles.infoContainer}>
                <Text>Distância: {distance.toFixed(2)} km</Text>
                <Text>Velocidade Média Necessária: {neededSpeed.toFixed(2)} km/h</Text>
                <Text>Velocidade Atual: {currentSpeed.toFixed(2)} km/h</Text>
                <Timer status={status} timer={timer} />
            </View>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: userLocation?.latitude || 37.78825,
                    longitude: userLocation?.longitude || -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {userLocation && (
                    <Marker coordinate={userLocation} title="Sua Localização" />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    infoContainer: {
        marginVertical: 20,
    },
    map: {
        flex: 1,
        height: 400,
    },
});

export default App;