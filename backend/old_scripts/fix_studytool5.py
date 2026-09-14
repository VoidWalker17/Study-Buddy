with open("frontend/src/pages/StudyTool.tsx", "r") as f:
    code = f.read()

old_handleTeach = """  const handleTeach = async () => {
    if (!teachingText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ml/extract-concepts', {
        explanation: teachingText,
        user_id: userId,
        source_concepts: result?.concepts || []
      });
      setTaughtConcepts(prev => [...prev, ...response.data.extracted_concepts]);
      setTeachingText("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to teach concept. The AI server might be unreachable.");
    } finally {
      setLoading(false);
    }
  };"""

new_handleTeach = """  const handleTeach = async () => {
    if (!teachingText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ml/extract-concepts', {
        explanation: teachingText,
        user_id: userId,
        source_concepts: result?.concepts || []
      });
      if (response.data.extracted_concepts && response.data.extracted_concepts.length > 0) {
        setTaughtConcepts(prev => [...prev, ...response.data.extracted_concepts]);
        setTeachingText("");
      } else {
        setError("AI couldn't extract any concepts, or the API is rate-limited (Google Gemini Free Tier). Please wait 30 seconds and try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to teach concept. The AI server might be unreachable.");
    } finally {
      setLoading(false);
    }
  };"""

code = code.replace(old_handleTeach, new_handleTeach)

with open("frontend/src/pages/StudyTool.tsx", "w") as f:
    f.write(code)

print("Fixed handleTeach")
