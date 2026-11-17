import os
import json
import secrets
import hashlib
import hmac
import base64
import time
import sqlite3
from typing import Optional, List, Dict, Any

# Load .env file automatically
def _load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

_load_env()

DATABASE_URL = os.environ.get("DATABASE_URL")
SUPABASE_HOST = os.environ.get("SUPABASE_HOST")
SUPABASE_USER = os.environ.get("SUPABASE_USER", "postgres")
SUPABASE_PASS = os.environ.get("SUPABASE_PASS", "")
SUPABASE_DB = os.environ.get("SUPABASE_DB", "postgres")

USE_POSTGRES = bool(DATABASE_URL or SUPABASE_HOST)

if USE_POSTGRES:
    try:
        import psycopg2
        import psycopg2.extras
        print("Database Mode: Supabase Cloud PostgreSQL")
    except ImportError:
        USE_POSTGRES = False
        print("Database Mode: Local SQLite Fallback")
else:
    print("Database Mode: Local SQLite")

def _get_db_path():
    if os.environ.get("VERCEL"):
        tmp_path = "/tmp/studybuddy.db"
        if not os.path.exists(tmp_path):
            orig = os.path.join(os.path.dirname(__file__), "studybuddy.db")
            if os.path.exists(orig):
                import shutil
                try:
                    shutil.copy2(orig, tmp_path)
                except Exception as e:
                    print(f"Failed to copy template db: {e}")
        return tmp_path
    return os.path.join(os.path.dirname(__file__), "studybuddy.db")

DB_PATH = _get_db_path()

class DBConnection:
    """Unified wrapper around psycopg2 (Supabase) and sqlite3."""
    def __init__(self):
        self.is_pg = USE_POSTGRES
        if self.is_pg:
            try:
                if SUPABASE_HOST:
                    self.conn = psycopg2.connect(
                        host=SUPABASE_HOST,
                        port=5432,
                        user=SUPABASE_USER,
                        password=SUPABASE_PASS,
                        dbname=SUPABASE_DB,
                        connect_timeout=3
                    )
                else:
                    self.conn = psycopg2.connect(DATABASE_URL, connect_timeout=3)
                self.cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                return
            except Exception as e:
                # Do not spam or block when cloud host is unreachable from serverless container
                self.is_pg = False

        db_file = _get_db_path()
        self.conn = sqlite3.connect(db_file, timeout=20.0, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA journal_mode = WAL")
        self.conn.execute("PRAGMA synchronous = NORMAL")
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.cursor = self.conn.cursor()

    def execute(self, sql: str, params: tuple = ()):
        if self.is_pg:
            # Replace sqlite '?' placeholder with postgres '%s'
            pg_sql = sql.replace("?", "%s")
            self.cursor.execute(pg_sql, params)
        else:
            self.cursor.execute(sql, params)
        return self.cursor

    def fetchone(self):
        row = self.cursor.fetchone()
        if row is None:
            return None
        return dict(row)

    def fetchall(self):
        rows = self.cursor.fetchall()
        return [dict(r) for r in rows]

    def commit(self):
        self.conn.commit()

    def close(self):
        try:
            self.cursor.close()
            self.conn.close()
        except Exception:
            pass

def get_db():
    try:
        return DBConnection()
    except Exception as e:
        print(f"Warning: Supabase connection failed ({e}), using local SQLite fallback.")
        # Temporarily fallback
        global USE_POSTGRES
        orig = USE_POSTGRES
        USE_POSTGRES = False
        conn = DBConnection()
        USE_POSTGRES = orig
        return conn

def init_db():
    """Initializes tables if using SQLite."""
    if not USE_POSTGRES:
        db = get_db()
        db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            subject TEXT DEFAULT 'General',
            material_name TEXT,
            status TEXT DEFAULT 'in_progress',
            baseline_score REAL DEFAULT 0.0,
            final_score REAL DEFAULT 0.0,
            tes_score REAL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS concepts (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            name TEXT NOT NULL,
            definition TEXT NOT NULL,
            confidence REAL DEFAULT 1.0,
            type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
        );
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            question_text TEXT NOT NULL,
            expected_answer TEXT NOT NULL,
            difficulty TEXT DEFAULT 'medium',
            concepts_json TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
        );
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS exam_results (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            exam_type TEXT NOT NULL,
            child_answer TEXT NOT NULL,
            score REAL NOT NULL,
            feedback TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
        );
        """)
        db.execute("""
        CREATE TABLE IF NOT EXISTS auth_tokens (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """)
        db.commit()
        db.close()

# ----------------- Hashing & Cryptography ----------------- #

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return hashed, salt

def verify_password(password: str, password_hash: str, salt: str) -> bool:
    hashed, _ = hash_password(password, salt)
    return secrets.compare_digest(hashed, password_hash)

# ----------------- User Authentication Operations ----------------- #

def create_user(name: str, email: str, password: str) -> Dict[str, Any]:
    db = get_db()
    email_clean = email.strip().lower()
    
    try:
        db.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
        if db.fetchone():
            db.close()
            raise ValueError("An account with this email already exists. Please sign in.")
            
        user_id = "usr_" + secrets.token_hex(8)
        password_hash, salt = hash_password(password)
        
        db.execute(
            "INSERT INTO users (id, name, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)",
            (user_id, name.strip(), email_clean, password_hash, salt)
        )
        db.commit()
    except Exception as e:
        db.close()
        err_str = str(e).lower()
        if "unique" in err_str or "duplicate" in err_str or "already exists" in err_str:
            raise ValueError("An account with this email already exists. Please sign in.")
        raise ValueError(f"Account creation error: {str(e)}")
    db.close()
    
    return {"id": user_id, "name": name.strip(), "email": email_clean}

AUTH_SECRET = os.environ.get("AUTH_SECRET", "studybuddy-feynman-jwt-secret-2026-key")

def generate_signed_token(user_id: str, name: str, email: str) -> str:
    """Generates a tamper-proof cryptographic token that verifies across any serverless instance without DB hits."""
    payload = {
        "uid": user_id,
        "name": name,
        "email": email,
        "iat": int(time.time()),
        "exp": int(time.time()) + (30 * 86400) # 30 days
    }
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(payload_json).decode('utf-8').rstrip('=')
    sig = hmac.new(AUTH_SECRET.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"sbt_{payload_b64}.{sig}"

def verify_signed_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a tamper-proof cryptographic token in-memory."""
    if not token or not token.startswith("sbt_"):
        return None
    try:
        raw = token[4:]
        if "." not in raw:
            return None
        payload_b64, sig = raw.rsplit(".", 1)
        expected_sig = hmac.new(AUTH_SECRET.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        padding = 4 - (len(payload_b64) % 4)
        if padding and padding < 4:
            payload_b64 += "=" * padding
        payload_data = json.loads(base64.urlsafe_b64decode(payload_b64.encode('utf-8')).decode('utf-8'))
        
        if payload_data.get("exp", 0) < int(time.time()):
            return None
            
        return {
            "id": payload_data["uid"],
            "name": payload_data["name"],
            "email": payload_data["email"]
        }
    except Exception as e:
        print(f"Token decode error: {e}")
        return None

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    email_clean = email.strip().lower()
    
    db.execute("SELECT id, name, email, password_hash, salt FROM users WHERE email = ?", (email_clean,))
    row = db.fetchone()
    
    if not row or not verify_password(password, row["password_hash"], row["salt"]):
        db.close()
        return None
        
    token = generate_signed_token(row["id"], row["name"], row["email"])
    try:
        db.execute("INSERT INTO auth_tokens (token, user_id) VALUES (?, ?)", (token, row["id"]))
        db.commit()
    except Exception as e:
        print(f"Token insert warning: {e}")
    finally:
        db.close()
    
    return {
        "token": token,
        "user": {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"]
        }
    }

def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    # 1. Instant cryptographic stateless token verification (works 100% across all serverless instances)
    signed_user = verify_signed_token(token)
    if signed_user:
        return signed_user

    # 2. Database lookup fallback for legacy tokens
    try:
        db = get_db()
        db.execute("""
            SELECT u.id, u.name, u.email, u.created_at
            FROM users u
            JOIN auth_tokens t ON u.id = t.user_id
            WHERE t.token = ?
        """, (token,))
        row = db.fetchone()
        db.close()
        return row
    except Exception as e:
        print(f"Token db lookup warning: {e}")
        return None

def delete_token(token: str):
    db = get_db()
    db.execute("DELETE FROM auth_tokens WHERE token = ?", (token,))
    db.commit()
    db.close()

# ----------------- Learning Session Operations ----------------- #

def create_session(user_id: str, title: str, subject: str = "General", material_name: str = "") -> str:
    session_id = "ses_" + secrets.token_hex(8)
    try:
        db = get_db()
        # If user does not exist in this instance's SQLite yet, insert record so foreign keys pass cleanly
        db.execute("SELECT id FROM users WHERE id = ?", (user_id,))
        if not db.fetchone():
            db.execute(
                "INSERT OR IGNORE INTO users (id, name, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)",
                (user_id, "Feynman Scholar", f"{user_id}@studybuddy.app", "", "")
            )
            db.commit()
            
        db.execute(
            "INSERT INTO sessions (id, user_id, title, subject, material_name, status) VALUES (?, ?, ?, ?, ?, ?)",
            (session_id, user_id, title.strip() or "Untitled Session", subject.strip(), material_name, "in_progress")
        )
        db.commit()
        db.close()
    except Exception as e:
        print(f"create_session warning: {e}")
    return session_id

def save_concepts(session_id: str, concepts: List[Dict[str, Any]], concept_type: str = "source"):
    db = get_db()
    for c in concepts:
        cid = "cpt_" + secrets.token_hex(8)
        db.execute(
            "INSERT INTO concepts (id, session_id, name, definition, confidence, type) VALUES (?, ?, ?, ?, ?, ?)",
            (cid, session_id, c.get("name", "Unknown"), c.get("definition", ""), float(c.get("confidence", 1.0)), concept_type)
        )
    db.commit()
    db.close()

def save_questions(session_id: str, questions: List[Dict[str, Any]]) -> List[str]:
    db = get_db()
    q_ids = []
    for q in questions:
        qid = "qst_" + secrets.token_hex(8)
        q_ids.append(qid)
        concepts_json = json.dumps(q.get("concepts", []))
        db.execute(
            "INSERT INTO questions (id, session_id, question_text, expected_answer, difficulty, concepts_json) VALUES (?, ?, ?, ?, ?, ?)",
            (qid, session_id, q.get("question", ""), q.get("expectedAnswer", ""), q.get("difficulty", "medium"), concepts_json)
        )
    db.commit()
    db.close()
    return q_ids

def save_exam_result(session_id: str, question_id: str, exam_type: str, child_answer: str, score: float, feedback: str):
    db = get_db()
    res_id = "res_" + secrets.token_hex(8)
    db.execute(
        "INSERT INTO exam_results (id, session_id, question_id, exam_type, child_answer, score, feedback) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (res_id, session_id, question_id, exam_type, child_answer, float(score), feedback)
    )
    db.commit()
    db.close()

def complete_session(session_id: str, baseline_score: float, final_score: float, tes_score: float):
    db = get_db()
    db.execute(
        "UPDATE sessions SET baseline_score = ?, final_score = ?, tes_score = ?, status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (baseline_score, final_score, tes_score, session_id)
    )
    db.commit()
    db.close()

def get_user_sessions(user_id: str) -> List[Dict[str, Any]]:
    db = get_db()
    db.execute("""
        SELECT id, title, subject, material_name, status, baseline_score, final_score, tes_score, created_at, updated_at
        FROM sessions
        WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))
    rows = db.fetchall()
    db.close()
    # Format created_at to string if it's datetime
    for r in rows:
        if r.get("created_at") and not isinstance(r["created_at"], str):
            r["created_at"] = str(r["created_at"])
    return rows

def get_session_details(session_id: str) -> Optional[Dict[str, Any]]:
    db = get_db()
    db.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
    session = db.fetchone()
    if not session:
        db.close()
        return None

    db.execute("SELECT * FROM concepts WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    session["concepts"] = db.fetchall()

    db.execute("SELECT * FROM questions WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    session["questions"] = db.fetchall()

    db.execute("SELECT * FROM exam_results WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    session["exam_results"] = db.fetchall()
    db.close()

    return session

def get_user_analytics(user_id: str) -> Dict[str, Any]:
    db = get_db()
    db.execute("SELECT COUNT(*) as total_sessions FROM sessions WHERE user_id = ?", (user_id,))
    total_sessions = db.fetchone()["total_sessions"]

    db.execute("SELECT AVG(tes_score) as avg_tes, AVG(baseline_score) as avg_base, AVG(final_score) as avg_final FROM sessions WHERE user_id = ? AND status = 'completed'", (user_id,))
    stats = db.fetchone()
    avg_tes = round(float(stats.get("avg_tes") or 0.0), 1)
    avg_base = round(float(stats.get("avg_base") or 0.0), 1)
    avg_final = round(float(stats.get("avg_final") or 0.0), 1)

    db.execute("""
        SELECT COUNT(DISTINCT name) as total_concepts
        FROM concepts c
        JOIN sessions s ON c.session_id = s.id
        WHERE s.user_id = ? AND c.type = 'taught'
    """, (user_id,))
    concepts_mastered = db.fetchone()["total_concepts"]
    db.close()

    return {
        "total_sessions": total_sessions,
        "avg_tes": avg_tes,
        "avg_baseline": avg_base,
        "avg_final": avg_final,
        "concepts_mastered": concepts_mastered,
        "improvement_rate": round(max(0.0, avg_final - avg_base), 1)
    }

init_db()
