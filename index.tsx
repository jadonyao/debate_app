import { useRouter } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter()

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow:1}]}>
      <Text style={styles.title}>Speak Up</Text>
      <Text style={styles.subtitle}>Train your voice, logic, and argument skills</Text>

      {/* debate card */}
      <TouchableOpacity style={styles.card} onPress={() => router.push('/debate')}>
        <ImageBackground
          source={{ uri: 'https://img.freepik.com/free-photo/empowering-voices_23-2151947868.jpg' }}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay}>
            <Text style={styles.cardText}>Start a Debate</Text>
            <Text style={styles.cardDesc}>Choose a topic and let AI help you build your case.</Text>
          </View>

        </ImageBackground>
      </TouchableOpacity>

      {/* game card */}
      <TouchableOpacity style={styles.card} onPress={() => router.push('/game')}>
        <ImageBackground
          source={require('@/assets/images/game.jpg')}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay}>
            <Text style={styles.cardText}>Logic Game</Text>
            <Text style={styles.cardDesc}>Sharpen your logical skills by spotting fallacies in arguements.</Text>
          </View>

        </ImageBackground>
      </TouchableOpacity>

      {/* evaluate card */}

      <TouchableOpacity style={styles.card} onPress={() => router.push('/evaluate')}>
        <ImageBackground
          source={{ uri: 'https://img.freepik.com/free-photo/businesswoman-giving-presentation_23-2151947886.jpg' }}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay}>
            <Text style={styles.cardText}>Evaluate Your Speech</Text>
            <Text style={styles.cardDesc}>Record or type your arguement and get instant AI feedback.</Text>
          </View>

        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/about')}>
        <text style={styles.aboutLink}>Learn more about Speakup →</text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgb(241, 227, 147)',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center'
  },
  card: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  cardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent:'flex-end'
  },
  cardImage: {
    resizeMode:'cover'
  },

  cardOverlay: {
    backgroundColor:'rgba(234, 160, 1, 0.4)',  
    padding: 10,
    paddingLeft: 15
  },
  cardText: {
    fontSize: 22,
    fontWeight: 'bold',
    color:'fff',
  },
  cardDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: 'fff',
    marginTop: 4,
    lineHeight:18,
  },
  
  aboutLink: {
    marginTop: 24,
    fontSize: 14,
    color: "#007aff",
    textDecorationLine: 'underline',
    fontFamily: 'Nunito-Regular'
  },
});


