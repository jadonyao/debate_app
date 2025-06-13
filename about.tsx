import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 About SpeakUp</Text>
      <Text style={styles.description}>
      SpeakUp is a debate training app for teens. It helps you explore topics, choose roles,
generate arguments using AI, and evaluate your performance with feedback. You can
also play logic games to sharpen your reasoning skills. 
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});
