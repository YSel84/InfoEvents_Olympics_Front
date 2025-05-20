// Description: Écran mobile de scan de billets avec expo-camera v51 et CameraView

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import WebWrapper from '../components/WebWrapper';
import MainButton from '../components/ui/MainButton';
import { fetchWithAuth } from '../lib/_api';
import { useAuthStore } from '../../stores/authStore';

export default function ScanScreen() {
    const { roles } = useAuthStore();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    // États du scan
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // 1) Plateforme web interdite
    if (Platform.OS === 'web') {
        return (
            <WebWrapper>
                <View style={styles.center}>
                    <Text>Cette page n'est disponible que sur mobile.</Text>
                </View>
            </WebWrapper>
        );
    }

    // 2) Rôle EMPLOYEE requis
    if (!roles.includes('EMPLOYEE')) {
        return (
            <WebWrapper>
                <View style={styles.center}>
                    <Text>Accès réservé aux employés.</Text>
                </View>
            </WebWrapper>
        );
    }

    if (!permission) {
        // En cours de chargement
        return (
            <WebWrapper>
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            </WebWrapper>
        );
    }

    if (!permission.granted) {
        // Demande d’autorisation
        return (
            <WebWrapper>
                <View style={styles.center}>
                    <Text style={styles.message}>
                        Nous avons besoin de la permission d'accéder à la caméra
                    </Text>
                    <MainButton
                        label="Autoriser la caméra"
                        onPress={requestPermission}
                    />
                </View>
            </WebWrapper>
        );
    }

    // Gestion du scan
    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        setScanned(true);
        setLoading(true);
        try {
            const ticketId = parseInt(data, 10);
            const res = await fetchWithAuth('/tickets/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId }),
            });
            const json = await res.json();
            setMessage(res.ok ? 'Billet validé !' : json.error || 'Erreur');
        } catch {
            setMessage('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" />}

            {message && <Text style={styles.message}>{message}</Text>}

            {!scanned && (
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    onBarcodeScanned={handleBarCodeScanned}
                />
            )}

            {scanned && (
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        setScanned(false);
                        setMessage(null);
                    }}
                >
                    <Text style={styles.resetText}>
                        Scanner un autre billet
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    camera: { flex: 1 },
    message: {
        textAlign: 'center',
        padding: 16,
        fontSize: 18,
    },
    resetButton: {
        margin: 16,
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
        alignSelf: 'center',
    },
    resetText: {
        color: 'white',
        fontSize: 16,
    },
});
