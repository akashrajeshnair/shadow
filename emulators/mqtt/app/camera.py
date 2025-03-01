from flask import Response, Blueprint
import subprocess

camera_bp = Blueprint("camera", __name__)

# Path to the fake pre-recorded video
VIDEO_PATH = "app/fake_camera.mp4"

def generate_frames():
    """Use FFmpeg to continuously stream video frames."""
    ffmpeg_command = [
        "ffmpeg", "-re", "-stream_loop", "-1", "-i", VIDEO_PATH,  # Infinite loop
        "-f", "mjpeg", "-q:v", "5", "pipe:1"
    ]
    
    process = subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    while True:
        frame = process.stdout.read(1024)
        if not frame:
            break
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@camera_bp.route('/api/mqtt/device/camera/stream')
def video_feed():
    """Returns a fake MJPEG video stream"""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
