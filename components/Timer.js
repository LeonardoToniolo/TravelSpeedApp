import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ status, timer }) => {
    return (
        <View style={[styles.timerContainer, status === 'above' ? styles.above : styles.below]}>
            <Text style={styles.timerText}>Tempo: {timer} segundos</Text>
            <Text style={styles.statusText}>
                Status: {status === 'above' ? 'Acima da velocidade' : 'Abaixo da velocidade'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    timerContainer: {
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    above: {
        backgroundColor: '#d4edda',
    },
    below: {
        backgroundColor: '#f8d7da',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 16,
    },
});

export default Timer;