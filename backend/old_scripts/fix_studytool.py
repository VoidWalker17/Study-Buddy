with open("frontend/src/pages/StudyTool.tsx", "r") as f:
    code = f.read()

old_runExam = """  const runExam = async () => {
    if (!result?.questions || result.questions.length === 0) {
      setError("No questions generated for this document. Cannot start exam.");
      return;
    }
    setExamQuestions(result.questions);
    setCurrentStep(3);
    setExamAnswers({});
  };"""

new_runExam = """  const runExam = async () => {
    if (!result?.questions || result.questions.length === 0) {
      // Retry generating questions
      try {
        setLoading(true);
        setError("");
        const res = await axios.post('/api/ml/generate-questions', { concepts: result?.concepts || [] });
        if (res.data.questions && res.data.questions.length > 0) {
          setResult({ ...result, questions: res.data.questions });
          setExamQuestions(res.data.questions);
          setCurrentStep(3);
          setExamAnswers({});
        } else {
          setError("Still couldn't generate questions. Please try again.");
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to generate questions. Model may be rate-limited.");
      } finally {
        setLoading(false);
      }
      return;
    }
    setExamQuestions(result.questions);
    setCurrentStep(3);
    setExamAnswers({});
  };"""

code = code.replace(old_runExam, new_runExam)

with open("frontend/src/pages/StudyTool.tsx", "w") as f:
    f.write(code)

print("Fixed StudyTool")
