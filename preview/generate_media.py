import os, subprocess, urllib.request, tempfile, shutil
OUT=os.path.join(os.path.dirname(__file__),"assets")
os.makedirs(OUT,exist_ok=True)
# Every source licensed under https://www.pexels.com/license/
CLIPS=[
 ("01-infrastructure",7140928,"https://www.pexels.com/video/close-up-of-a-cpu-7140928/"),
 ("02-intelligence",33717250,"https://www.pexels.com/video/glowing-red-abstract-structure-animation-33717250/"),
 ("03-systems",6330779,"https://www.pexels.com/video/close-up-view-of-a-man-doing-computer-programming-6330779/")
]
for name,video_id,page in CLIPS:
 url=f"https://www.pexels.com/download/video/{video_id}/"
 req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0","Referer":"https://www.pexels.com/"})
 with tempfile.NamedTemporaryFile(suffix=".mp4",delete=False) as temporary:
  source=temporary.name
 try:
  with urllib.request.urlopen(req,timeout=90) as response,open(source,"wb") as output:
   shutil.copyfileobj(response,output)
  if os.path.getsize(source)<20000:
   raise ValueError("Downloaded file too small")
  target=os.path.join(OUT,f"{name}.mp4")
  subprocess.run(["ffmpeg","-y","-loglevel","error","-i",source,"-t","8","-an","-vf","scale=1280:-2,fps=24","-c:v","libx264","-preset","fast","-crf","28","-pix_fmt","yuv420p","-movflags","+faststart",target],check=True)
  subprocess.run(["ffmpeg","-y","-loglevel","error","-ss","1","-i",target,"-frames:v","1",os.path.join(OUT,f"{name}.jpg")],check=True)
  print(name,os.path.getsize(target),"source:",page)
 finally:
  os.unlink(source)

# Retry publication with conflict-safe workflow.
