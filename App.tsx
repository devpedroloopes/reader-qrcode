import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, Modal, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const qrCodeLock = useRef(false);

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert('Câmera', 'Você precisa habilitar o uso da câmera');
      }

      setModalIsVisible(true);
      qrCodeLock.current = false;
    } catch (error) {
      console.log(error);
    }
  }

  function handleQRCodeRead(data: string) {
    setModalIsVisible(false);
    setScannedData(data);
    Alert.alert('QRCode', 'Dados extraídos com sucesso!');
  }

  function handleCopyToClipboard() {
    if (scannedData) {
      Clipboard.setStringAsync(scannedData);
      Alert.alert('Sucesso', 'Dados copiados para a área de transferência!');
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scanButton} onPress={handleOpenCamera}>
        <Text style={styles.scanButtonText}>Ler QRCode</Text>
      </TouchableOpacity>

      {scannedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Dados do QRCode:</Text>
          <Text style={styles.resultData}>{scannedData}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyToClipboard}>
            <Text style={styles.copyButtonText}>Copiar Dados</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalIsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <CameraView
            style={styles.cameraView}
            facing="back"
            onBarcodeScanned={({ data }) => {
              if (data && !qrCodeLock.current) {
                qrCodeLock.current = true;
                setTimeout(() => handleQRCodeRead(data), 500);
              }
            }}
          />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalIsVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  scanButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultData: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
  },
  cameraView: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
