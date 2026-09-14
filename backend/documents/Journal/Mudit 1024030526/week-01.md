# Week 1 Journal — Study Buddy

## System Architecture & Design

Week 1 focused on converting the Study Buddy idea into an initial technical architecture.

---

## Architecture Overview

We identified the main components required for the system:

* Login / Signup
* Study Resource Upload
* Teacher Agent
* Child Agent
* Memory & Learning Engine
* Test Generation
* Test Evaluation
* Dashboard

The architecture is based on keeping the Teacher Agent and Child Agent separate. The Teacher Agent can access the study material, while the Child Agent learns only from the student's teaching.

---

## Main Components

### Teacher Agent

The Teacher Agent processes the uploaded resources and acts as the reference for generating and evaluating tests.

### Child Agent

The Child Agent learns from the student's explanations through text, with voice support planned for a later stage.

### Memory & Learning Engine

The learning engine extracts concepts, definitions, relationships, and confidence information from the teaching session and stores them as the Child Agent's memory.

---

## Basic Architecture Flow

The initial architecture follows:

**Login → Upload Resources → Teacher Processes Resources → Baseline Test → Student Teaches → Memory → Test → Evaluation → Dashboard**

This matches the main flow represented in our system architecture diagram.

---

## Technology Planning

The proposed technology stack includes:

* **Frontend:** React.js / Next.js
* **Backend:** Python / FastAPI
* **AI:** Pre-trained LLMs
* **Database:** PostgreSQL
* **Memory:** FAISS / ChromaDB
* **Document Processing:** PyPDF
* **Voice:** Whisper
* **Visualization:** Chart.js

---

## Challenges

The main challenges were:

* Keeping the two agents properly separated.
* Preventing the Child Agent from accessing the original resources.
* Deciding how the memory system should work.
* Connecting all the components without making the architecture unnecessarily complicated.

---

## Individual Contribution

My main contribution this week was **system architecture**.

I worked on:

* Identifying the main system components.
* Defining the Teacher and Child Agent responsibilities.
* Planning the Memory & Learning Engine.
* Designing the initial system architecture.
* Planning the technology stack.
* Connecting the testing and evaluation components.

---

## Next Week Goals

* Prepare the **Gantt Chart**.
* Create the **Use Case Diagram**.
* Refine the system architecture.
* Finalize agent responsibilities.
* Further define the database and memory structure.
* Coordinate the architecture with the workflow.

---

## Conclusion

Week 1 gave us the initial technical structure of Study Buddy. The major components and their responsibilities were identified, giving us a base for detailed system design in the following week.
