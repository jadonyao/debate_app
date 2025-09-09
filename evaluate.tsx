import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { OpenAI_API_Key } from '../components/OpenAI_API_Key';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function EvaluateScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // recording states
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OpenAI_API_Key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are an argument evaluation coach for students. When a user inputs an argument, give polite, clear, bullet-pointed feedback on clarity, logic, persuasiveness, and tone.',
            },
            ...messages,
            userMessage,
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      const assistantMessage: Message = { role: 'assistant', content: reply || 'Error.' };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get a response.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (msg: Message) => {
    setLoading(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OpenAI_API_Key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are an argument evaluation coach for students. When a user inputs an argument, give polite, clear, bullet-pointed feedback on clarity, logic, persuasiveness, and tone.',
            },
            msg,
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      const assistantMessage: Message = { role: 'assistant', content: reply || 'Error.' };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Microphone permission is needed to record');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording: ', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);

      if (uri) {
        await handleTranscription(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording: ', err);
      setIsRecording(false);
    }
  };

  const handleTranscription = async (uri: string) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      } as any);
      formData.append('model', 'whisper-1');

      const transcriptionResponse = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OpenAI_API_Key}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );

      const transcriptionData = await transcriptionResponse.json();
      const transcribedText = transcriptionData.text;

      setMessages((prev) => [...prev, { role: 'user', content: transcribedText }]);

      const summary = `I heard: "${transcribedText}"`;
      setMessages((prev) => [...prev, { role: 'assistant', content: summary }]);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OpenAI_API_Key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are an argument evaluation coach for students. When a user enters an argument, give polite, clear, bullet-pointed answers touching on quality, delivery, and logic.',
            },
            {
              role: 'user',
              content: transcribedText,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply || 'Error.' }]);
    } catch (error) {
      console.error('Transcription or Evaluation failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <ScrollView
            ref={scrollRef}
            style={styles.chat}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 && !loading && (
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>Start a Conversation</Text>
                <Text style={styles.welcomeSubtitle}>
                  Type an argument below and get AI-powered feedback.
                </Text>
              </View>
            )}

            {messages.map((msg, index) => (
              <View
                key={index}
                style={[styles.bubble, msg.role === 'user' ? styles.user : styles.assistant]}
              >
                <Text style={styles.bubbleText}>{msg.content}</Text>
                {msg.role === 'assistant' && (
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleCopy(msg.content)}>
                      <Ionicons name="copy-outline" size={15} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => messages[index - 1] && handleRefresh(messages[index - 1])}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={15}
                        color="#555"
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}

            {loading && (
              <View style={[styles.bubble, styles.assistant]}>
                <Text style={styles.bubbleText}>Thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* 🎤 Recording Controls */}
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                <Ionicons name="stop" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={{ marginLeft: 12, color: 'red', fontWeight: 'bold' }}>
                Recording...
              </Text>
            </View>
          ) : (
            <View style={styles.recordingContainer}>
              <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                <Ionicons name="mic" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={{ marginLeft: 12, color: '#333' }}>Tap mic to start</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type your argument..."
              value={input}
              onChangeText={setInput}
              style={styles.input}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefc',
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chat: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chatContent: {
    paddingBottom: 16,
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: screenWidth * 0.8,
  },
  user: {
    backgroundColor: '#ffd33d',
    alignSelf: 'flex-end',
  },
  assistant: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#ffd33d',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendText: {
    fontWeight: 'bold',
  },
  welcomeCard: {
    marginTop: 80,
    padding: 24,
    backgroundColor: 'rgba(253, 238, 141, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(253, 238, 141, 0.5)',
    marginHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  actions: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },

  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  
  recordButton: {
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  
  stopButton: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
