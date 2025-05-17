from database import get_connection

def save_message(user_id: int, role: str, message: str) -> None:
    """
    Inserts a single chat message into chat_messages.
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO chat_messages (user_id, role, message)
                VALUES (%s, %s, %s)
                """,
                (user_id, role, message)
            )
        conn.commit()
    finally:
        conn.close()


def get_last_messages(user_id: int, limit: int = 10) -> list[tuple[str, str]]:
    """
    Returns the last `limit` messages for this user as (role, message) tuples,
    oldest first.
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT role, message
                  FROM chat_messages
                 WHERE user_id = %s
                 ORDER BY created_at DESC
                 LIMIT %s
                """,
                (user_id, limit)
            )
            rows = cur.fetchall()
        return list(reversed(rows))
    finally:
        conn.close()
