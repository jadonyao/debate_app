import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { OPENAI_API_KEY } from '../components/openai';
  
export default function DebateScreen() {
  const [topic, setTopic] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const usedRole = role === 'custom' ? customRole : role;
    const prompt = `I'm preparing for a debate. My role is "${usedRole}". The topic is "${topic}". Please generate key points and a simple outline for my stance.`;

    setLoading(true);
    setChat(prev => [...prev, `🧑 You: ${prompt}`]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],

        }),
      });

      const data = await response.json();

      // console.log('API KEY:', OPENAI_API_KEY);
      console.log('RAW RESPONSE:', data);


      const reply = data.choices?.[0]?.message?.content;
      if (reply) setChat(prev => [...prev, `🤖 AI: ${reply}`]);
    } catch (error) {
      setChat(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎯 Start a Debate</Text>

      <TextInput
        placeholder="Enter a debate topic..."
        style={styles.input}
        value={topic}
        onChangeText={setTopic}
      />

      <Text style={styles.label}>Choose a role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Government" value="government" />
        <Picker.Item label="Opposition" value="opposition" />
        <Picker.Item label="Custom Role" value="custom" />
      </Picker>

      {role === 'custom' && (
        <TextInput
          placeholder="Enter your custom role..."
          style={styles.input}
          value={customRole}
          onChangeText={setCustomRole}
        />
      )}

      <TouchableOpacity onPress={handleGenerate} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Thinking...' : 'Generate Arguments'}</Text>
      </TouchableOpacity>

      <View style={styles.chatBox}>
        {chat.map((msg, i) => (
          <Text key={i} style={styles.chatText}>{msg}</Text>
        ))}
        {loading && <ActivityIndicator color="#000" style={{ marginTop: 10 }} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  picker: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ffd33d',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: '700',
  },
  chatBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
  },
  chatText: {
    marginBottom: 10,
    lineHeight: 20,
  },
});
