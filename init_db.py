import psycopg2
import cred


def create_tables():
    conn = psycopg2.connect(**cred.getDbConfig())

    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            username VARCHAR(100) NOT NULL,
            role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher')),
            current_grade INTEGER,

            CHECK (
                (role = 'student' AND current_grade IN (5, 6))
                OR
                (role = 'teacher' AND current_grade IS NULL)
            )
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS games (
            id SERIAL PRIMARY KEY,
            game_key VARCHAR(100) UNIQUE NOT NULL,
            grade INTEGER NOT NULL CHECK (grade IN (5, 6)),
            unit INTEGER NOT NULL,
            week INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
            score INTEGER DEFAULT 0,
            completion_status BOOLEAN DEFAULT FALSE,
            completed_at TIMESTAMP,

            UNIQUE (user_id, game_id)
        );
    """)

    conn.commit()
    cur.close()
    conn.close()

    print("Supabase tabloları başarıyla oluşturuldu.")


if __name__ == "__main__":
    create_tables()