from fastapi import APIRouter, Query
from database import get_connection
from fastapi import HTTPException

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("/")
def get_all_devices():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM devices")
        rows = cur.fetchall()
        column_names = [desc[0] for desc in cur.description]
        data = [dict(zip(column_names, row)) for row in rows]
    conn.close()
    return data

@router.get("/{device_id}/data")
def get_device_data(device_id: str, limit: int = Query(10, ge=1)):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT *
                FROM sensors
                WHERE device_id = %s
                ORDER BY time_created_at DESC
                LIMIT %s
            """, (device_id, limit))
            rows = cur.fetchall()
            column_names = [desc[0] for desc in cur.description]
            data = [dict(zip(column_names, row)) for row in rows]
        conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/data")
def get_all_devices_data(limit: int = Query(10, ge=1)):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT *
                FROM sensors
                ORDER BY time_created_at DESC
                LIMIT %s
            """, (limit,))
            rows = cur.fetchall()
            column_names = [desc[0] for desc in cur.description]
            data = []
            for row in rows:
                row_dict = dict(zip(column_names, row))
                if 'time_created_at' in row_dict and row_dict['time_created_at']:
                    row_dict['time_created_at'] = row_dict['time_created_at'].strftime("%Y-%m-%d %H:%M:%S")
                data.append(row_dict)
        conn.close()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
