"""Download and web-optimize the selected licensed Pexels Chrome Motion video."""
from pathlib import Path
import subprocess
import tempfile
import urllib.request

OUT = Path(__file__).resolve().parent / "assets"
OUT.mkdir(parents=True, exist_ok=True)
CLIPS = (
    ("07-chrome-motion", 34630589, 10.0),
)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/132.0.0.0 Safari/537.36",
    "Referer": "https://www.pexels.com/",
}

def download(video_id, dest):
    request = urllib.request.Request(f"https://www.pexels.com/download/video/{video_id}/", headers=HEADERS)
    with urllib.request.urlopen(request, timeout=120) as response, dest.open("wb") as output:
        content_type = response.headers.get("Content-Type", "")
        if not any(x in content_type for x in ("video", "octet-stream")):
            raise RuntimeError(f"Unexpected content type for {video_id}: {content_type}")
        while chunk := response.read(1024 * 1024):
            output.write(chunk)
    if dest.stat().st_size < 50000:
        raise RuntimeError(f"Video {video_id} too small")

for name, video_id, duration in CLIPS:
    target = OUT / f"{name}.mp4"
    poster = OUT / f"{name}.jpg"
    with tempfile.TemporaryDirectory() as folder:
        source = Path(folder) / f"{video_id}.mp4"
        print(f"Downloading Pexels {video_id}", flush=True)
        download(video_id, source)
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(source), "-t", str(duration), "-an",
            "-vf", "scale=w=1280:h=-2:flags=lanczos,fps=24",
            "-c:v", "libx264", "-preset", "medium", "-crf", "29",
            "-maxrate", "1400k", "-bufsize", "2800k",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(target)
        ], check=True)
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", "1", "-i", str(target), "-frames:v", "1", "-q:v", "4", str(poster)
        ], check=True)
        print(f"Optimized {name}: {target.stat().st_size // 1024} KB", flush=True)
