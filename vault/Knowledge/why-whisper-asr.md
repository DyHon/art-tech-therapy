# Why Whisper for ASR
- Source(s): converted (VI→EN) from `docs/why using_/tại sao phải sử dụng Whisper cho ASR_.docx` (Google Doc export).

## Summary
From a Web Developer's perspective, Whisper is chosen over traditional Cloud ASR services because it directly solves three critical problems in the Art-Tech Therapy architecture. It robustly transcribes the low-quality "sleepy" audio of freshly-woken dream recordings, it can run locally to satisfy our Zero Data Retention and Zero-Knowledge requirements, and it can transcribe and translate Vietnamese straight into English in a single pass.

From a Web Developer's technical perspective, choosing Whisper (an Automatic Speech Recognition technology) instead of traditional Cloud ASR services (such as the Google Cloud Speech-to-Text API or AWS Transcribe) is not simply because it is "popular." It directly solves three critical problems in the architecture of our Art-Tech Therapy system:

## 1. The nature of "Dream Data" (Hypnopompic Data)
When a user has just woken up and opens the app to record their dream, their psychological and physiological state is very particular:
- Non-standard speech: They will speak in a drowsy, faint, mumbling, broken voice, or in an extremely low tone.
- Chaotic context: The user is recalling and narrating at the same time, with sentences that lack clear grammatical structure.

Traditional ASR engines (which are optimized for recognizing call-center commands or voice search) will very easily return inaccurate results or "give up" (no speech detected) when faced with this kind of low-quality audio.

Whisper is trained on an enormous dataset containing a lot of noise and many different speaking styles, giving it an extremely strong "listening comprehension" ability in real-world environments, accurately extracting every word even when the user is whispering drowsily.

## 2. The absolute constraint of the Security Policy (Zero Data Retention)
This is the most important reason from a system architecture standpoint:
- If you use a traditional Cloud API, you must stream the user's audio file up to a third party's server. This creates a "data footprint" outside of your control and violates the Zero-Knowledge Architecture philosophy that we are building.
- Whisper has an Open Source version that runs Locally extremely smoothly (Whisper.cpp or whisper-sharp): You or Antigravity can embed the Whisper model directly into your own Backend server (Node.js/Python server). The audio file sent up from the Client is processed locally right on your infrastructure, and once it is converted to text the function to delete the raw file executes immediately. Not a single byte of voice data leaks out to the internet.

## 3. Direct Translation capability
A very "worth-the-money" feature of Whisper is that it not only turns speech into text (Transcription), but it also has the ability to recognize Vietnamese and translate it straight into English (Translation) in the same processing pass.
- Why is this needed? Although our analytical AI (Gemini) understands Vietnamese very well, when working with the complex academic terminology of Carl Jung and computing vector distances (pgvector), input data in English will sometimes deliver higher synchronized accuracy. Whisper can act as the input filter, converting "drowsy Vietnamese speech" into "standard English text" to feed into the analytical AI core.

### In summary, from the Developer's perspective:
We choose Whisper because it Reads drowsy speech the best, Allows running Locally for absolute security, and Optimizes the input data flow for the downstream processing system.

## Related notes
- [[architecture-vision]]
- [[roadmap-5-milestones]]
