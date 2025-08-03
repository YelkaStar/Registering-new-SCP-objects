import sqlite3
from typing import List, Dict
from models import Creature

DB_PATH = 'MainBase.sqlite'

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def add_creature_to_db(creature: Creature) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO anomalies (name, threat_level, description, location, status)
        VALUES (?, ?, ?, ?, ?)
        """,
        (creature.name, creature.threat_level, creature.description, creature.location, creature.status)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id

def get_all_creatures_from_db() -> List[Dict]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, threat_level, description, location, status FROM anomalies"
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row[0],
            "name": row[1],
            "threat_level": row[2],
            "description": row[3],
            "location": row[4],
            "status": row[5],
        }
        for row in rows
    ]
