import numpy as np, cv2, math, os, subprocess
W,H=768,432
FPS=24
N=144
Y,X=np.mgrid[0:H,0:W].astype(np.float32)
xx=(X-W/2)/H
yy=(Y-H/2)/H
out=os.path.join(os.path.dirname(__file__),'assets')
os.makedirs(out,exist_ok=True)
def make(name,kind):
 p=os.path.join(out,name+'.mp4')
 v=cv2.VideoWriter(p,cv2.VideoWriter_fourcc(*'mp4v'),FPS,(W,H))
 for frame in range(N):
  t=frame/N*2*math.pi
  radius=np.sqrt(xx**2+yy**2)
  grain=np.random.default_rng(frame+900).normal(0,1,(H,W)).astype('float32')
  if kind==0:
   b=3+12*np.maximum(0,1-radius/1.1)
   light=np.exp(-((xx-.28)**2+(yy+.12)**2)/.22)*16
   pix=np.stack([b*1.05+light*.5,b*.98+light*.37,b*1.25+light*.25],2)
   horizon=np.exp(-(yy-.09)**2/.07)*(15+12*np.sin(xx*13+t))
   pix[:,:,0]+=horizon*.55
   pix[:,:,1]+=horizon*.25
   pix[:,:,2]+=horizon*.4
  elif kind==1:
   b=5+13*np.exp(-((xx+.08)**2+(yy-.04)**2)/.3)
   pix=np.stack([b*.7,b*1.3,b*2.2],2)
  else:
   b=6+13*np.exp(-((xx-.3)**2+(yy+.1)**2)/.34)
   pix=np.stack([b,b*1.05,b*1.35],2)
  pix+=grain[:,:,None]*1.1
  a=np.uint8(np.clip(pix,0,255))
  if kind==0:
   van=(int(W*.63),int(H*.49))
   for i in range(16):
    depth=((i/16+t/(2*math.pi)*.32)%1.0)**2
    hw=int(20+depth*650)
    hh=int(13+depth*340)
    alpha=(1-depth)**.42
    col=(int(42*alpha),int(30*alpha),int(155*alpha))
    pts=np.array([[van[0]-hw,van[1]-hh],[van[0]+hw,van[1]-hh],[van[0]+hw,van[1]+hh],[van[0]-hw,van[1]+hh]],np.int32)
    cv2.polylines(a,[pts],True,col,1,cv2.LINE_AA)
   for i in range(25):
    phase=i/25*2*math.pi+t*.15
    rad=45+abs(math.sin(phase*1.3+t))*400
    pt=(int(van[0]+math.cos(phase)*rad),int(van[1]+math.sin(phase)*rad*.6))
    cv2.circle(a,pt,1,(55,55,220),-1,cv2.LINE_AA)
   center=(int(W*.65),int(H*.48))
   for j in range(5):
    r=int(44+j*8+4*math.sin(t))
    cv2.ellipse(a,center,(r,int(r*.86)),27+t*3,10,340,(25+j*9,27+j*6,135+j*16),1,cv2.LINE_AA)
   cv2.circle(a,center,28,(70,74,218),1,cv2.LINE_AA)
  elif kind==1:
   for j in range(38):
    pts=[]
    for x in range(0,W,12):
     y=H*.5+math.sin(x*.014+j*.3+t*.65)*35+math.sin(x*.005-t+j*.06)*75+(j-18)*5
     pts.append((x,int(y)))
    hue=int(60+90*j/38)
    cv2.polylines(a,[np.array(pts,np.int32)],False,(min(255,100+j*2),hue,55+j*2),1,cv2.LINE_AA)
   for k in range(140):
    phase=k*2.39996+t*.19
    r=math.sqrt((k+.5)/140)
    x=int(W*.54+math.cos(phase)*r*W*.43)
    y=int(H*.5+math.sin(phase)*r*H*.42)
    if 0<=x<W and 0<=y<H:
     cv2.circle(a,(x,y),1 if k%4 else 2,(180,130,90),-1,cv2.LINE_AA)
  else:
   for j in range(-20,30):
    x=int((j*48+t*24)%(W+160)-80)
    cv2.line(a,(x,0),(x-180,H),(32,31,40),1,cv2.LINE_AA)
   for j in range(12):
    y=int(j*43+(t*9)%43)
    cv2.line(a,(0,y),(W,y),(31,28,33),1,cv2.LINE_AA)
   center=(int(W*.63),int(H*.5))
   for j in range(9):
    r=55+j*14
    cv2.ellipse(a,center,(int(r*1.5),int(r*.6)),25+t*10,25+j*6,290,(60+j*5,58+j*4,70+j*8),2 if j%3==0 else 1,cv2.LINE_AA)
   cv2.circle(a,center,30,(135,136,170),2,cv2.LINE_AA)
  v.write(a)
  if frame==42: cv2.imwrite(os.path.join(out,name+'.jpg'),a,[cv2.IMWRITE_JPEG_QUALITY,88])
 v.release()
 tmp=p+'.tmp.mp4'
 subprocess.run(['ffmpeg','-y','-loglevel','error','-i',p,'-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',tmp],check=True)
 os.replace(tmp,p)
for name,i in [('01-infrastructure',0),('02-intelligence',1),('03-systems',2)]:
 make(name,i)
