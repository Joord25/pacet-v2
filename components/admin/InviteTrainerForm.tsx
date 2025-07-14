import { commonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface InviteTrainerFormProps {
  onInvite: (email: string, name: string) => Promise<boolean>;
  onClose: () => void;
}

export const InviteTrainerForm: React.FC<InviteTrainerFormProps> = ({ onInvite, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleInvite = async () => {
    // 유효성 검사는 Context에서 처리하므로 여기서는 간단히 호출만 합니다.
    const success = await onInvite(email, name);
    if (success) {
      setName('');
      setEmail('');
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>트레이너 초대</ThemedText>
      
      <ThemedText style={styles.label}>트레이너 이름</ThemedText>
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="초대할 트레이너의 이름"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoFocus
      />
      
      <ThemedText style={styles.label}>트레이너 이메일</ThemedText>
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="초대할 트레이너의 이메일 주소"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.buttonContainer}>
        <Button title="취소" onPress={onClose} color="red" />
        <Button title="초대장 보내기" onPress={handleInvite} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}); 