import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 About SpeakUp 📘</Text>
      <Text style={styles.description}>
      SpeakUp is a debate training app for novice or experienced debaters. 
      This advanced app also helps you explore topics, generate arguments using AI.
      AI will evaluate your speech by analyzing a recording or a typed transcript.
      You can also play logic games to sharpen your reasoning skills. 
      </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(202, 234, 237)',
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
    backgroundColor: 'rgb(224, 224, 218)',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  
  description: {
    fontSize: 26,
    color: '#555',
    textAlign: 'center',
    lineHeight: 30,
    backgroundColor: 'rgb(249, 246, 201)',
    marginBottom: 20, 
    marginTop: 10,
    paddingVertical: 10, 
    paddingHorizontal: 15,
  },
});
