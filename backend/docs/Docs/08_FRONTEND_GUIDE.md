# Frontend Guide

## Overview
The Study Buddy frontend is a modern web application built with React, TypeScript, and Vite. It features a responsive UI styled with Tailwind CSS v4, animations powered by GSAP, and icons from Lucide React. It also includes PDF generation capabilities using jsPDF.

## Core Component
The core user interface is contained in:
- `frontend/src/pages/StudyTool.tsx`

## Core User Flow (3 Steps)
The main component `StudyTool.tsx` implements a 3-step workflow:

### 1. Upload PDF
- The user uploads a PDF containing the study material.
- The frontend sends this file to the backend (`/process-document`) to extract concepts and generate exam questions.
- A "Download PDF" button is available (using `jsPDF`) to download the generated questions.

### 2. Teach Agent
- The user explains the concepts they learned from the PDF, either via text or voice.
- The explanation is sent to the backend (`/extract-concepts`) to compare with the ground truth concepts.
- The structured knowledge is assigned a confidence score and stored in the backend memory.

### 3. Evaluate
- The frontend initiates the exam phase.
- For each question, it calls `/retrieve-memory` to let the "Child Agent" answer based ONLY on what the student taught it.
- The frontend then calls `/grade-answer` to let the "Teacher Agent" evaluate the Child Agent's answer against the expected answer.
- The final **Efficacy Score** is calculated as the average of the 10 grades received.
