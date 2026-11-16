import os
from database import (
    init_db, create_user, authenticate_user, get_user_by_token,
    create_session, save_concepts, save_questions, save_exam_result,
    complete_session, get_user_sessions, get_session_details, get_user_analytics,
    DB_PATH
)

def test_database_suite():
    print(f"Testing database at: {DB_PATH}")
    init_db()

    # 1. Test User Registration
    test_email = "divyansh_test@example.com"
    test_name = "Divyansh"
    test_pass = "SecurePass123!"

    try:
        user = create_user(test_name, test_email, test_pass)
        print("PASS: create_user created:", user)
    except ValueError as e:
        print("Note: user already exists, proceeding to login test.")

    # 2. Test Login & Auth Token
    auth_data = authenticate_user(test_email, test_pass)
    assert auth_data is not None, "Login failed with correct credentials"
    token = auth_data["token"]
    user_id = auth_data["user"]["id"]
    print(f"PASS: authenticate_user successful. Token: {token[:12]}... User ID: {user_id}")

    # 3. Test Token Verification
    verified_user = get_user_by_token(token)
    assert verified_user is not None and verified_user["email"] == test_email
    print("PASS: get_user_by_token retrieved:", verified_user["name"])

    # 4. Test Session Lifecycle
    session_id = create_session(user_id, "Interference of Light", "Physics", "interference.pdf")
    print("PASS: create_session created session_id:", session_id)

    # 5. Save Concepts & Questions
    sample_concepts = [
        {"name": "Wave Superposition", "definition": "When waves overlap, their amplitudes add.", "confidence": 1.0},
        {"name": "Coherence", "definition": "Waves maintain constant phase difference.", "confidence": 0.9}
    ]
    save_concepts(session_id, sample_concepts, "source")
    print("PASS: save_concepts (source) succeeded.")

    sample_questions = [
        {"question": "Explain wave superposition.", "expectedAnswer": "Amplitudes sum algebraically.", "difficulty": "medium", "concepts": ["Wave Superposition"]},
        {"question": "Define coherence.", "expectedAnswer": "Constant relative phase.", "difficulty": "hard", "concepts": ["Coherence"]}
    ]
    q_ids = save_questions(session_id, sample_questions)
    assert len(q_ids) == 2
    print("PASS: save_questions stored questions:", q_ids)

    # 6. Save Baseline Exam & Final Exam results
    save_exam_result(session_id, q_ids[0], "baseline", "I do not know yet.", 10.0, "Blank answer.")
    save_exam_result(session_id, q_ids[0], "final", "When waves overlap their displacements add algebraically.", 90.0, "Excellent explanation.")

    # 7. Complete Session with TES
    complete_session(session_id, baseline_score=10.0, final_score=90.0, tes_score=80.0)
    print("PASS: complete_session marked completed.")

    # 8. Check History and Analytics
    sessions = get_user_sessions(user_id)
    assert len(sessions) >= 1
    print(f"PASS: get_user_sessions returned {len(sessions)} session(s).")

    details = get_session_details(session_id)
    assert len(details["questions"]) == 2
    assert len(details["exam_results"]) == 2
    print("PASS: get_session_details retrieved complete breakdown.")

    analytics = get_user_analytics(user_id)
    print("PASS: get_user_analytics output:", analytics)
    print("\nALL DATABASE TESTS PASSED 100%!")

if __name__ == "__main__":
    test_database_suite()
