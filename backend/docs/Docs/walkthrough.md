# Walkthrough

## Summary of Changes

1. **Title Fix**: Updated `index.html` title to precisely "StudyBuddy" without any suffixes.
2. **Voice Input Fix**: Replaced the custom raw `SpeechRecognition` logic with `react-speech-recognition`. This correctly handles interim and final speech chunks, directly appending spoken transcripts to the text area.
3. **Neural Memory Confidence Fix**: 
    - The LLM previously just identified concepts and hardcoded high confidence scores.
    - Updated `ml_routes.py` and `StudyTool.tsx` to pass the `source_concepts` (from the PDF) to the `extract_student_explanation_concepts` function.
    - Updated the LLM prompt to actively compare the student's explanation against the source material's definition, assigning low confidence if the explanation is simplistic, confused, or admits partial knowledge (like 40% understanding).
4. **Final Exam Button Fix**: 
    - Fixed a bug where a large number of concepts caused token overflow during question generation, returning an empty array. This caused `runExam` to skip the loop and silently do nothing.
    - Sliced concepts to a maximum of 5 to guarantee valid JSON question generation.
    - Added an explicit error state in `StudyTool.tsx` if questions fail to generate, preventing silent failures.
5. **Playwright Tests**: Added a basic `tests/core-flow.spec.ts` script verifying the title and navigation (Start -> Tool -> Back).
