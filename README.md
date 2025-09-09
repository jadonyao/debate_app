**SpeakUp** is a comprehensive debate app designed to help debaters—especially students—improve their logical reasoning and argumentation skills through fun, interactive AI features.
### 🎙️ Voice-Based Argument Evaluation

- Long-press the mic icon to record your argument.
- AI transcribes your voice using **OpenAI's Whisper API**.
- The app summarizes your argument and gives feedback powered by **GPT-4o**.

### 🎮 Logic Game Mode

- Play a game where GPT generates silly or funny questions.
- Learn how to identify logical flaws and sharpen reasoning skills.
- Each round includes 5 questions with score tracking.

### 📝 Chat-Based Feedback

- Get real-time feedback from AI in a chat format.
- Each message includes a **copy** button and **refresh** option to regenerate AI responses.

---
- Unlike traditional tools that rely on judges or lectures, SpeakUp gives **personalized**, **real-time**, and **interactive** feedback anytime.
- Kids and teens stay engaged with logic games instead of boring text or videos.
- Built-in recording and feedback means **no more incomplete ballots** or long waits for evaluation.

---

## 📈 Results

- Be more prepared for debate tournaments or real-life arguments.
- Build **confidence**, **clarity**, and **persuasiveness**.
- Improve logic **while having fun**!

---

## 🛠️ Tech Stack

| Component       | Technology                    |
| --------------- | ----------------------------- |
| Frontend        | React Native (Expo)           |
| Voice Recording | `expo-av`, `expo-file-system` |
| AI Integration  | OpenAI Whisper API + GPT-3.5 turbo API   |
| Styling         | React Native StyleSheet       |
| Icons           | `react-native-vector-icons`   |

---
2. Set up your OpenAI API key
Create openai_api_key.ts file in the component folder
Put your key in the file:
   ```
   export const OPENAI_API_KEY ='<Your OpenAI API Key>'
   ```
## Project Structure

```
.
├── app
│   ├── _layout.tsx
│   ├── (tabs)
│   ├── +not-found.tsx
│   ├── debate.tsx
│   ├── evaluate_new.tsx
│   ├── evaluate.tsx
│   ├── game.tsx
│   └── gameOLD.tsx
├── app.json
├── assets
│   ├── fonts
│   └── images
├── components
│   └── openai.ts
├── eslint.config.js
├── expo-env.d.ts
├── ios
│   ├── debateapppre
│   ├── debateapppre.xcodeproj
│   ├── Podfile
│   └── Podfile.properties.json
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
