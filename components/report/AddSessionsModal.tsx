import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AddSessionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (sessions: number) => void;
  memberName: string;
};

export const AddSessionsModal: React.FC<AddSessionsModalProps> = ({ isVisible, onClose, onSubmit, memberName }) => {
  const [sessions, setSessions] = useState('');

  const handleSubmit = () => {
    const sessionCount = parseInt(sessions, 10);
    if (!isNaN(sessionCount) && sessionCount > 0) {
      onSubmit(sessionCount);
      setSessions(''); // 입력 필드 초기화
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={modalStyles.centeredView}
      >
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>{memberName} 회원</Text>
          <Text style={modalStyles.modalSubtitle}>추가할 수업 횟수를 입력하세요.</Text>
          
          <TextInput
            style={modalStyles.input}
            onChangeText={setSessions}
            value={sessions}
            placeholder="예: 30"
            keyboardType="number-pad"
            autoFocus={true}
          />

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonClose]}
              onPress={onClose}
            >
              <Text style={modalStyles.textStyleClose}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonSubmit]}
              onPress={handleSubmit}
            >
              <Text style={modalStyles.textStyleSubmit}>추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    modalSubtitle: { marginBottom: 20, textAlign: 'center', color: '#6B7280' },
    input: { height: 50, width: '100%', borderColor: '#D1D5DB', borderWidth: 1, marginBottom: 20, textAlign: 'center', borderRadius: 10, fontSize: 18 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    button: { borderRadius: 10, padding: 12, elevation: 2, flex: 1, marginHorizontal: 5 },
    buttonClose: { backgroundColor: '#E5E7EB' },
    buttonSubmit: { backgroundColor: '#FF5C00' },
    textStyleClose: { color: '#374151', fontWeight: 'bold', textAlign: 'center' },
    textStyleSubmit: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
}); 