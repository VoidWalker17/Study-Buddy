import re

with open("frontend/src/pages/StudyTool.tsx", "r") as f:
    code = f.read()

# Replace states
code = code.replace(
    "const [isListening, setIsListening] = useState(false);\n  const recognitionRef = useRef<any>(null);",
    "const { transcript, listening: isListening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();"
)

# Replace toggleListening
new_toggle = """  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
      return;
    }
    if (isListening) {
      SpeechRecognition.stopListening();
      setTeachingText(prev => prev + (prev && transcript ? ' ' : '') + transcript);
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };"""

# We need to replace the entire toggleListening block.
# Let's find it.
start_idx = code.find("const toggleListening = () => {")
end_idx = code.find("recognition.start();\n    setIsListening(true);\n  };") + len("recognition.start();\n    setIsListening(true);\n  };")

if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
    code = code[:start_idx] + new_toggle + code[end_idx:]
else:
    print("Could not find toggleListening")

# Replace textarea
textarea_search = """<textarea
                          className="w-full h-64 p-6 bg-[#0a0a0c] border border-white/10 rounded-3xl resize-none text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base placeholder-zinc-600 shadow-inner"
                          placeholder="Explain a concept in your own words. For example: 'An operating system is the software that manages computer hardware and software resources...'"
                          value={teachingText}
                          onChange={(e) => setTeachingText(e.target.value)}
                        />"""

textarea_replace = """<textarea
                          className="w-full h-64 p-6 bg-[#0a0a0c] border border-white/10 rounded-3xl resize-none text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base placeholder-zinc-600 shadow-inner"
                          placeholder="Explain a concept in your own words. For example: 'An operating system is the software that manages computer hardware and software resources...'"
                          value={isListening ? (teachingText + (teachingText && transcript ? ' ' : '') + transcript) : teachingText}
                          onChange={(e) => {
                            if (!isListening) setTeachingText(e.target.value);
                          }}
                        />"""

code = code.replace(textarea_search, textarea_replace)

with open("frontend/src/pages/StudyTool.tsx", "w") as f:
    f.write(code)

print("Done")
