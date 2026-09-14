# Week 1 Journal — Study Buddy

## System Workflow & Process Design

Week 1 focused on understanding and defining how a student will actually use Study Buddy from beginning to end.

---

## Overall Workflow

The initial workflow was defined as:

**Login → Upload Resources → Teacher Processes Resources → Baseline Test → Student Teaches Child Agent → Memory Building → Test → Evaluation → Dashboard**

This follows the core workflow described in our project proposal.

---

## Main Steps

### 1. Upload Resources

The student uploads study material such as notes or PDFs. The Teacher Agent processes this material and uses it as the reference knowledge.

### 2. Cold Baseline

Before teaching, the Child Agent takes a baseline test. This helps us understand what it already knows before the student's teaching session.

### 3. Teaching Session

The student teaches the Child Agent using their own explanation. The initial version focuses on text, while voice is planned as a future feature.

### 4. Memory Building

The Memory & Learning Engine extracts important concepts and information from the student's explanation and stores them as the Child Agent's memory.

### 5. Testing

The Teacher Agent generates a test from the original study material. The Child Agent then attempts the test using its own memory.

### 6. Evaluation

The Teacher Agent checks the Child Agent's answers against the source material and produces the evaluation result.

---

## Workflow Diagram

The initial workflow can be summarized as:

```text
Student
   ↓
Upload Resources
   ↓
Teacher Agent
   ↓
Cold Baseline
   ↓
Student Teaches
   ↓
Memory Engine
   ↓
Child Agent
   ↓
Test
   ↓
Teacher Agent Evaluates
   ↓
Dashboard
```

---

## Challenges

The main challenges were:

* Making the complete workflow easy to understand.
* Keeping the Teacher and Child Agent roles separate.
* Deciding where the baseline test should happen.
* Connecting teaching with the memory system.
* Making sure the final test measures what the student actually taught.

---

## Individual Contribution

My main contribution this week was **workflow design**.

I worked on:

* Defining the complete user journey.
* Planning the resource upload process.
* Defining the baseline test.
* Designing the teaching and memory-building flow.
* Planning the test and evaluation process.
* Connecting the workflow to the dashboard.

---

## Next Week Goals

* Prepare the **Gantt Chart**.
* Create the **Use Case Diagram**.
* Refine the complete system workflow.
* Detail the teaching and memory processes.
* Coordinate the workflow with the system architecture.
* Start planning the UI/UX flow.

---

## Conclusion

Week 1 helped us define how the different parts of Study Buddy will work together. The main learning loop of **teach → remember → test → evaluate** was established and will be refined further next week.
