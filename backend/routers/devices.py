from fastapi import APIRouter, Query
from database import get_connection
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/devices", tags=["Devices"])

#gets all devices information
@router.get("/")
def get_all_devices():
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM devices")
        rows = cur.fetchall()
        column_names = [desc[0] for desc in cur.description]
        data = []
        for row in rows:
            row_dict = dict(zip(column_names, row))
            for key in ['last_visibility', 'time_created_at']:
                if key in row_dict and isinstance(row_dict[key], datetime):
                    row_dict[key] = row_dict[key].strftime("%Y-%m-%d %H:%M:%S")
            data.append(row_dict)
    conn.close()
    return data


#gets the last default 10 data of a device
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

#gets the last default 10 data
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



#gets the data between specific range
@router.get("/{device_id}/data-range")
def get_device_data_by_range(
    device_id: str,
    start: datetime,
    end: datetime,
    limit: Optional[int] = Query(None, ge=1)
):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT *
                FROM sensors
                WHERE device_id = %s AND time_created_at >= %s AND time_created_at <= %s
                ORDER BY time_created_at DESC
                LIMIT %s
            """, (device_id, start, end, limit))
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



#change the device name
@router.post("/edit_device_name")
def edit_device_name(
    device_name: str,
    device_id: str
    ):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""UPDATE devices 
                        SET device_name = %s
                        WHERE device_id = %s""", 
                        (
                            device_name,
                            device_id
                        ))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="No matching device found for user.")

        conn.commit()
        conn.close()

        return {
            "message": f" Device name set as {device_name}"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

#makes the gps_request in devices table true
@router.post("/gps_request")
def send_gps_request(
    gps_request: bool,
    device_id: str
    ):
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("""UPDATE devices 
                        SET gps_request = %s
                        WHERE device_id = %s""", 
                        (
                            gps_request,
                            device_id
                        ))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="No matching device found for user.")

        conn.commit()
        conn.close()

        return {
            "message": f"GPS request set to {gps_request} for device {device_id}"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))