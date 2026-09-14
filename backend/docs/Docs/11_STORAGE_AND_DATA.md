# Storage and Data

## Backend Storage Mechanism
The Study Buddy project uses a highly simplified, ephemeral approach to data storage.

### The In-Memory Database
- **No Persistent Database**: The project does not utilize SQL, NoSQL, or any persistent file-based data stores.
- **`MOCK_DB`**: All state is maintained in a Python dictionary named `MOCK_DB` located in `api/routers/ml_routes.py`. 
- **Ephemeral Nature**: All session data, including uploaded PDF text, generated questions, and the Child Agent's learned memory, is wiped clean whenever the FastAPI server restarts.

### User Management
- **No Authentication**: The application bypasses user authentication entirely.
- **Hardcoded Identifier**: All data written to and read from `MOCK_DB` uses a hardcoded user key: `"test-user-123"`.

## Document Processing Data
- **PDF Extraction**: When a user uploads a PDF in Step 1, the frontend sends it to `/process-document`. The backend utilizes `PyPDF2` in `api/services/pdf_service.py` to extract raw text.
- **Transient Document State**: The extracted text is briefly held in memory, passed to `llm_service.py` to generate the ground truth and questions, and is not permanently archived.

## Final Output Data
- **Efficacy Score**: Calculated purely on the frontend/backend as the simple average of the 10 grades provided by the Teacher Agent.
- **Exporting**: The frontend (`StudyTool.tsx`) provides a "Download PDF" button leveraging `jsPDF` to allow the user to export the generated questions and results locally, compensating for the lack of persistent backend storage.
