
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const RESPONSES = [
  { keywords: ['enroll', 'how to enroll'], answer: 'To enroll a student:\n1. Go to Enrollments tab\n2. Tap + button\n3. Select student and section\n4. Tap Enroll Student\n\nFull sections cannot be selected.' },
  { keywords: ['full', 'capacity', 'no slots'], answer: 'Each section has a max student capacity. When full, it shows FULL and no more enrollments are accepted. Choose a different section.' },
  { keywords: ['drop', 'dropped', 'cancel'], answer: 'Admin or staff must update enrollment status to Dropped from the Enrollments page.' },
  { keywords: ['units', 'total units'], answer: 'Total units are calculated automatically from enrolled subjects. Check the Students page to see a student\'s total units.' },
  { keywords: ['section', 'what is section'], answer: 'A section is a class schedule for a subject with a room, schedule, instructor, and max capacity.' },
  { keywords: ['subject', 'subjects', 'courses'], answer: 'Subjects are courses offered each semester with a code, name, units, year level, and semester.' },
  { keywords: ['student id', 'id number'], answer: 'Student ID is a unique identifier (e.g. 2024-0001). It\'s required when adding a student.' },
  { keywords: ['login', 'sign in', 'password'], answer: 'Enter your email and password on the login screen. Contact admin if you forgot your password.' },
  { keywords: ['register', 'sign up', 'account'], answer: '1. Tap Register\n2. Fill in your details\n3. Check email for verification link\n4. Click link to activate\n5. Login!' },
  { keywords: ['verify', 'verification', 'email'], answer: 'Check your email inbox for a verification link after registering. Check spam if not found.' },
  { keywords: ['admin', 'role', 'staff', 'permission'], answer: 'Roles:\n- Admin: Full access\n- Staff: Manage students, subjects, sections, enrollments\n- Student: View own info' },
  { keywords: ['hello', 'hi', 'hey'], answer: 'Hello! I\'m your EnrollHub assistant. Ask me about enrollment, sections, subjects, or your account!' },
  { keywords: ['thanks', 'thank you', 'salamat'], answer: 'You\'re welcome! Feel free to ask anything else.' },
  { keywords: ['help', 'what can you do'], answer: 'I can help with:\n📋 Enrollment process\n🏫 Sections & capacity\n📚 Subjects & units\n👥 Student management\n🔐 Login & registration' },
];

const QUICK = ['How do I enroll?', 'Section is full?', 'What are roles?', 'How to register?'];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const item of RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) return item.answer;
  }
  return "I\'m not sure about that. Try asking about enrollment, sections, subjects, or your account. Or contact your administrator.";
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'assistant', content: "Hi! I\'m your EnrollHub assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(m => [
      ...m,
      { id: Date.now().toString(), role: 'user', content: msg },
      { id: (Date.now() + 1).toString(), role: 'assistant', content: getResponse(msg) }
    ]);
    setInput('');
    setShowQuick(false);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item: m }) => (
          <View style={[s.bubble, m.role === 'user' ? s.userBubble : s.botBubble]}>
            <Text style={[s.bubbleText, m.role === 'user' ? s.userText : s.botText]}>{m.content}</Text>
          </View>
        )}
        ListFooterComponent={showQuick ? (
          <View style={s.quickWrap}>
            <Text style={s.quickLabel}>Quick questions:</Text>
            <View style={s.quickRow}>
              {QUICK.map(q => (
                <TouchableOpacity key={q} style={s.quickBtn} onPress={() => send(q)}>
                  <Text style={s.quickText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      />
      <View style={s.inputRow}>
        <TextInput style={s.input} value={input} onChangeText={setInput} placeholder="Ask anything..." placeholderTextColor={colors.gray400} onSubmitEditing={() => send()} returnKeyType="send" blurOnSubmit={false} />
        <TouchableOpacity style={[s.sendBtn, !input.trim() && { opacity: 0.5 }]} onPress={() => send()} disabled={!input.trim()}>
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  list: { padding: 14, paddingBottom: 8 },
  bubble: { maxWidth: '82%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.gray200 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  userText: { color: '#fff' },
  botText: { color: colors.gray800 },
  quickWrap: { marginTop: 8 },
  quickLabel: { fontSize: 11, color: colors.gray400, marginBottom: 6 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  quickBtn: { backgroundColor: colors.primaryLight, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  quickText: { color: colors.primary, fontSize: 12, fontWeight: '500' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.gray200, gap: 8 },
  input: { flex: 1, backgroundColor: colors.gray50, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 },
  sendBtn: { width: 42, height: 42, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
