import { ThemedText } from "@/components/ThemedText";
import { commonStyles } from "@/styles/commonStyles";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CoachingNotesProps {
  initialNotes: string;
}

export function CoachingNotes({ initialNotes }: CoachingNotesProps) {
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    // In a real app, you would save this to a server or local storage.
    Alert.alert("저장 완료", "코칭 노트가 저장되었습니다.");
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>코칭 노트 📝</ThemedText>
      <View style={[styles.card, commonStyles.cardShadow]}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="회원님에 대한 프라이빗 메모를 남겨보세요. (예: 저번 주 스쿼트 자세 교정 필요, 최근 컨디션 저하 이슈 등)"
          value={notes}
          onChangeText={setNotes}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <ThemedText style={styles.saveButtonText}>저장</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
  },
  textInput: {
    height: 100,
    padding: 16,
    textAlignVertical: "top",
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 8,
    alignItems: "flex-end",
  },
  saveButton: {
    backgroundColor: "#4f46e5", // indigo-600
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
}); 