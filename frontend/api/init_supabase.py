import os
import psycopg2

# Load .env file if present
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

SUPABASE_HOST = os.environ.get("SUPABASE_HOST", "2406:da1a:109c:2602:6f79:95b9:4a55:72db")
SUPABASE_USER = os.environ.get("SUPABASE_USER", "postgres")
SUPABASE_PASS = os.environ.get("SUPABASE_PASS", "")
SUPABASE_DB = os.environ.get("SUPABASE_DB", "postgres")

def init_supabase():
    print(f"Connecting to Supabase at {SUPABASE_HOST}...")
    conn = psycopg2.connect(
        host=SUPABASE_HOST,
        port=5432,
        user=SUPABASE_USER,
        password=SUPABASE_PASS,
        dbname=SUPABASE_DB,
        connect_timeout=10
    )
    cur = conn.cursor()

    # 1. Users Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    # 2. Sessions Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        subject TEXT DEFAULT 'General',
        material_name TEXT,
        status VARCHAR(32) DEFAULT 'in_progress',
        baseline_score FLOAT DEFAULT 0.0,
        final_score FLOAT DEFAULT 0.0,
        tes_score FLOAT DEFAULT 0.0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    # 3. Concepts Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS concepts (
        id VARCHAR(64) PRIMARY KEY,
        session_id VARCHAR(64) REFERENCES sessions(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        definition TEXT NOT NULL,
        confidence FLOAT DEFAULT 1.0,
        type VARCHAR(32) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    # 4. Questions Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(64) PRIMARY KEY,
        session_id VARCHAR(64) REFERENCES sessions(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        expected_answer TEXT NOT NULL,
        difficulty VARCHAR(32) DEFAULT 'medium',
        concepts_json JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    # 5. Exam Results Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS exam_results (
        id VARCHAR(64) PRIMARY KEY,
        session_id VARCHAR(64) REFERENCES sessions(id) ON DELETE CASCADE,
        question_id VARCHAR(64) REFERENCES questions(id) ON DELETE CASCADE,
        exam_type VARCHAR(32) NOT NULL,
        child_answer TEXT NOT NULL,
        score FLOAT NOT NULL,
        feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    # 6. Auth Tokens Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS auth_tokens (
        token VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    conn.commit()
    print("SUCCESS: All Supabase tables created successfully!")

    # Verify tables
    cur.execute("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cur.fetchall()]
    print("Tables in Supabase public schema:", tables)

    cur.close()
    conn.close()

if __name__ == "__main__":
    init_supabase()
