import os
import duckdb
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import uuid
import numpy as np
import pandas as pd

telemetry_bp = Blueprint('telemetry_bp', __name__)

# Define a temporary folder for uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'temp_uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def format_time(total_seconds):
    if not isinstance(total_seconds, (int, float)) or total_seconds < 0:
        return '0:00.000'
    minutes = int(total_seconds // 60)
    seconds = total_seconds % 60
    return f"{minutes}:{seconds:06.3f}"

def make_json_serializable(data):
    """Recursively converts numpy and pandas types to native Python types."""
    if isinstance(data, dict):
        return {key: make_json_serializable(value) for key, value in data.items()}
    if isinstance(data, list):
        return [make_json_serializable(element) for element in data]
    if isinstance(data, (np.ndarray, pd.Series)):
        return data.tolist()
    if isinstance(data, np.integer):
        return int(data)
    if isinstance(data, np.floating):
        return float(data)
    if isinstance(data, (np.datetime64, np.timedelta64, pd.Timestamp)):
        return str(data)
    if pd.isna(data):
        return None
    return data

@telemetry_bp.route('/telemetry/analyze', methods=['POST'])
def analyze_telemetry():
    if 'telemetryFile' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['telemetryFile']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file and file.filename.endswith('.duckdb'):
        temp_filename = str(uuid.uuid4()) + '.duckdb'
        temp_filepath = os.path.join(UPLOAD_FOLDER, temp_filename)
        
        try:
            file.save(temp_filepath)
            file_size_bytes = os.path.getsize(temp_filepath)
            current_app.logger.debug(f">>> File saved to: {temp_filepath}, Size: {file_size_bytes} bytes")
            
            con = duckdb.connect()
            con.execute(f"ATTACH '{temp_filepath}' AS lmu (READ_ONLY, BLOCK_SIZE 16384);")
            
            # Get official lap times and lap start timestamps
            official_times_query = 'SELECT value FROM lmu."Lap Time" ORDER BY ts'
            official_times = [row[0] for row in con.execute(official_times_query).fetchall()]

            lap_starts_query = 'SELECT ts FROM lmu.Lap ORDER BY ts'
            lap_start_timestamps = [row[0] for row in con.execute(lap_starts_query).fetchall()]

            calculated_laps = []
            
            # The number of calculable laps is one less than the number of lap start markers
            num_laps = len(lap_start_timestamps) - 1

            # Loop from 1 to skip the out-lap (i=0)
            for i in range(1, num_laps):
                # Lap number for display should start at 1 for the first flying lap
                lap_number = i 
                
                # Get the official time, aligning with the loop index
                official_time = official_times[i] if i < len(official_times) else 0.0

                is_valid = official_time > 5

                final_time = 0.0
                if is_valid:
                    final_time = official_time
                else:
                    # manual_time for lap i is the difference between start of lap i+1 and start of lap i
                    manual_time = lap_start_timestamps[i+1] - lap_start_timestamps[i]
                    final_time = manual_time
                
                calculated_laps.append({
                    "lapNumber": lap_number,
                    "timeSeconds": final_time,
                    "formatted": format_time(final_time),
                    "valid": is_valid
                })

            con.close()

            response_data = {
                "laps": calculated_laps,
                "temp_filename": temp_filename
            }

            return jsonify(response_data)

        except duckdb.Error as e:
            return jsonify({"error": f"Database processing error: {e}"}), 500
        except Exception as e:
            current_app.logger.error(f"An unexpected error occurred during analysis: {e}", exc_info=True)
            return jsonify({"error": f"An unexpected error occurred: {e}"}), 500
    
    return jsonify({"error": "Invalid file type. Please upload a .duckdb file"}), 400


@telemetry_bp.route('/telemetry/query', methods=['POST'])
def query_telemetry():
    data = request.get_json()
    filename = data.get('filename')
    query = data.get('query')

    if not filename or not query:
        return jsonify({"error": "Filename and query are required"}), 400

    temp_filepath = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
    if not os.path.exists(temp_filepath):
        return jsonify({"error": f"File not found: {filename}"}), 404
    
    try:
        con = duckdb.connect()
        con.execute(f"ATTACH '{temp_filepath}' AS lmu (READ_ONLY, BLOCK_SIZE 16384);")
        
        result_data = con.execute(query).df()
        con.close()

        # The key fix: convert the DataFrame to a list of dicts
        # and then clean it for JSON serialization.
        result_list = result_data.to_dict('records')
        serializable_result = make_json_serializable(result_list)
        
        return jsonify(serializable_result)
    
    except duckdb.Error as e:
        current_app.logger.error(f"Database query error: {e}", exc_info=True)
        return jsonify({"error": f"Database query error: {e}"}), 500
    except Exception as e:
        current_app.logger.error(f"An unexpected error occurred during query: {e}", exc_info=True)
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500