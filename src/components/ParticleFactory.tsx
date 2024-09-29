// TODO : 在粒子生成动画中应用鼠标影响
// TODO : caven尺寸改变时只需要让粒子改变

import React, { useRef, useState, useEffect } from 'react';

// 全局常量
const width = 400;
const height = 400;
const animateTime = 40;
const opacityStep = 1 / animateTime;
const Radius = 30;
const Inten = 0.25;
const LargeRadius = 400;
const LargeInten = 0.00005;
const BaseParticleRadius = 0.6;
const ParticleDensity = 7;

// 全局变量
/** 粒子对鼠标的敏感度 */
let mouseSensitivity = 5;
/** 明度阈值 (0-255) */
let brightnessThreshold = 100;
/** 透明度阈值 (0-255) */
let alphaThreshold = 16;
/** 整体缩放因子 */
let scale = 4;

// Logo 数据
const logos = [
  { label: "infected", url: "/images/03-world/infected.png" },
  { label: "nomadic_city", url: "/images/03-world/nomadic_city.png" },
  { label: "originium_arts", url: "/images/03-world/originium_arts.png" },
  { label: "originiums", url: "/images/03-world/originiums.png" },
  { label: "reunion", url: "/images/03-world/reunion.png" },
  { label: "island", url: "/images/rhodes_island.png" },
];

// 辅助函数
function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

function easeOutLog(t: number): number {
  // TODO: We need a better function
  return 1 - Math.pow(1.8, -12 * t);
}

/** 粒子类 */
class Particle {
  x: number;
  y: number;
  totalX: number;
  totalY: number;
  mx?: number;
  my?: number;
  vx?: number;
  vy?: number;
  time: number;
  r: number;
  color: number[];
  opacity: number;
  initialX: number;
  initialY: number;
  progress: number;
  animationProgress: number;
  animationDuration: number;
  initialOpacity: number;
  offsetX: number;
  offsetY: number;
  grayColor: number;
  exitVx?: number;
  exitVy?: number;

  constructor(totalX: number, totalY: number, time: number, color: number[]) {
    this.x = totalX;
    this.y = totalY;
    this.totalX = totalX;
    this.totalY = totalY;
    this.time = time;
    this.r = BaseParticleRadius * scale;
    this.color = [...color];
    this.opacity = 0;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(width, height) / 1.2; // 粒子初始位置范围
    this.initialX = width / 2 + Math.cos(angle) * radius;
    this.initialY = height / 2 + Math.sin(angle) * radius;
    this.x = this.initialX;
    this.y = this.initialY;
    this.initialOpacity = 0;
    this.opacity = this.initialOpacity;
    this.progress = 0;
    this.animationProgress = 0;
    this.animationDuration = 3000; // 出场动画持续时间
    this.offsetX = (Math.random() - 0.5) * 1;
    this.offsetY = (Math.random() - 0.5) * 1;
    this.grayColor = Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);
  }

  draw(ctx: CanvasRenderingContext2D, isGrayscale: boolean) {
    const centerX = width / 2;
    const centerY = height / 2;
    const scaledX = centerX + (this.x - centerX) * scale;
    const scaledY = centerY + (this.y - centerY) * scale;
    
    if (isGrayscale) {
      ctx.fillStyle = `rgba(${this.grayColor}, ${this.grayColor}, ${this.grayColor}, ${this.opacity})`;
    } else {
      ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
    }
    ctx.beginPath();
    ctx.arc(scaledX, scaledY, this.r, 0, Math.PI * 2);
    ctx.fill();
  }

  update(deltaTime: number, mouseX?: number, mouseY?: number) {
    if (this.animationProgress < this.animationDuration) {
      this.animationProgress += deltaTime;
      const progress = Math.min(this.animationProgress / this.animationDuration, 1);
      const easeProgress = easeOutLog(progress);
      this.x = lerp(this.initialX, this.totalX, easeProgress);
      this.y = lerp(this.initialY, this.totalY, easeProgress);
      this.opacity = lerp(this.initialOpacity, 1, easeProgress);
    } else {
      this.mx = this.totalX - this.x;
      this.my = this.totalY - this.y;
      this.vx = this.mx / this.time;
      this.vy = this.my / this.time;

      if (mouseX !== undefined && mouseY !== undefined) {
        const centerX = width / 2;
        const centerY = height / 2;
        const scaledMouseX = centerX + (mouseX - centerX) / scale;
        const scaledMouseY = centerY + (mouseY - centerY) / scale;
        let dx = scaledMouseX - this.x;
        let dy = scaledMouseY - this.y;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);

        if (distance < LargeRadius) {
          let largeDisPercent = LargeRadius / distance;
          largeDisPercent = largeDisPercent > 7 ? 7 : largeDisPercent;
          let largeAngle = Math.atan2(dy, dx);
          let largeCos = Math.cos(largeAngle);
          let largeSin = Math.sin(largeAngle);
          let largeRepX = largeCos * largeDisPercent * -LargeInten * mouseSensitivity;
          let largeRepY = largeSin * largeDisPercent * -LargeInten * mouseSensitivity;
          this.vx += largeRepX;
          this.vy += largeRepY;
        }

        let disPercent = Radius / distance;
        disPercent = disPercent > 7 ? 7 : disPercent;
        let angle = Math.atan2(dy, dx);
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let repX = cos * disPercent * -Inten * mouseSensitivity;
        let repY = sin * disPercent * -Inten * mouseSensitivity;
        this.vx += repX;
        this.vy += repY;
      }

      this.x += this.vx!;
      this.y += this.vy!;
    }

    if (this.opacity < 1) this.opacity += opacityStep;
  }

  change(x: number, y: number, color: number[]) {
    this.totalX = x;
    this.totalY = y;
    this.color = [...color];
    this.time = animateTime;
  }

  updateTransition(targetParticle: Particle | undefined, progress: number) {
    if (!targetParticle) return;
    
    this.totalX = lerp(this.totalX, targetParticle.totalX, progress);
    this.totalY = lerp(this.totalY, targetParticle.totalY, progress);
    this.color = this.color.map((c, i) => lerp(c, targetParticle.color[i], progress));
  }
}

/** Logo图片类 */
class LogoImg {
  src: string;
  name: string;
  particleData: Particle[];
  isLoaded: boolean;
  constructor(src: string, name: string) {
    this.src = src;
    this.name = name;
    this.particleData = [];
    this.isLoaded = false;
  
    if (src.endsWith('.svg')) {
      this.loadSVG(src);
    } else {
      this.loadImage(src);
    }
  }
  
  loadImage(src: string) {
    let img = new Image();
    img.crossOrigin = "";
    img.src = src;
    img.onload = () => {
      const tmp_canvas = document.createElement("canvas");
      const tmp_ctx = tmp_canvas.getContext("2d");
      const imgW = width * scale;
      const imgH = ~~(width * (img.height / img.width) * scale);
      tmp_canvas.width = imgW;
      tmp_canvas.height = imgH;
      tmp_ctx?.drawImage(img, 0, 0, imgW, imgH);
      const imgData = tmp_ctx?.getImageData(0, 0, imgW, imgH).data;
      tmp_ctx?.clearRect(0, 0, imgW, imgH);
  
      for (let y = 0; y < imgH; y += ParticleDensity) {
        for (let x = 0; x < imgW; x += ParticleDensity) {
          const index = (x + y * imgW) * 4;
          const r = imgData![index];
          const g = imgData![index + 1];
          const b = imgData![index + 2];
          const a = imgData![index + 3];
          const brightness = Math.max(r, g, b);
          if (brightness >= brightnessThreshold && a >= alphaThreshold) {
            const offsetX = (Math.random() * 2 - 1) / scale;
            const offsetY = (Math.random() * 2 - 1) / scale;
            const particle = new Particle((x / scale) + offsetX, (y / scale) + offsetY, animateTime, [r, g, b, a]);
            this.particleData.push(particle);
          }
        }
      }
      window.dispatchEvent(new CustomEvent('logoImageLoaded', { detail: { name: this.name } }));
    };
  }
  
  loadSVG(src: string) {
    fetch(src)
      .then(response => response.text())
      .then(svgText => {
        const svg = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svg);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const tmp_canvas = document.createElement("canvas");
          const tmp_ctx = tmp_canvas.getContext("2d");
          const imgW = width * scale;
          const imgH = ~~(width * (img.height / img.width) * scale);
          tmp_canvas.width = imgW;
          tmp_canvas.height = imgH;
          tmp_ctx?.drawImage(img, 0, 0, imgW, imgH);
          const imgData = tmp_ctx?.getImageData(0, 0, imgW, imgH).data;
          tmp_ctx?.clearRect(0, 0, imgW, imgH);
  
          for (let y = 0; y < imgH; y += ParticleDensity) {
            for (let x = 0; x < imgW; x += ParticleDensity) {
              const index = (x + y * imgW) * 4;
              const r = imgData![index];
              const g = imgData![index + 1];
              const b = imgData![index + 2];
              const a = imgData![index + 3];
              const sum = r + g + b + a;
              if (sum >= 100) {
                const offsetX = (Math.random() * 2 - 1) / scale;
                const offsetY = (Math.random() * 2 - 1) / scale;
                const particle = new Particle((x / scale) + offsetX, (y / scale) + offsetY, animateTime, [r, g, b, a]);
                this.particleData.push(particle);
              }
            }
          }
          window.dispatchEvent(new CustomEvent('logoImageLoaded', { detail: { name: this.name } }));
        };
      });
  }
}

// 画布类
class ParticleCanvas {
  canvasEle: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  ParticleArr: Particle[];
  mouseX?: number;
  mouseY?: number;
  currentLogo: LogoImg | null;
  particleAreaWidth: number;
  particleAreaHeight: number;
  lastUpdateTime: number;
  debug: boolean;
  isGrayscale: boolean;
  particleAreaX: number;
  particleAreaY: number;
  transitionProgress: number;
  isTransitioning: boolean;
  targetParticles: Particle[];
  private animationFrameId: number | null = null;
  private scale: number;
  private exitAnimationDuration: number = 1000; // 离场动画持续时间
  private newImageDelay: number = 100; // 新图片加载延迟
  private isExiting: boolean = false;
  private nextLogo: LogoImg | null = null;

  constructor(
    target: HTMLCanvasElement,
    particleAreaWidth: number,
    particleAreaHeight: number,
    isGrayscale: boolean,
    particleAreaX?: number,
    particleAreaY?: number,
    initialScale: number = 4
  ) {
    this.canvasEle = target;
    this.ctx = target.getContext("2d") as CanvasRenderingContext2D;
    this.width = target.width;
    this.height = target.height;
    this.ParticleArr = [];
    this.currentLogo = null;
    this.particleAreaWidth = particleAreaWidth;
    this.particleAreaHeight = particleAreaHeight;
    this.lastUpdateTime = performance.now();
    this.debug = false;
    this.isGrayscale = isGrayscale;
    this.particleAreaX = particleAreaX ?? this.width - this.particleAreaWidth - 50;
    this.particleAreaY = particleAreaY ?? (this.height - this.particleAreaHeight) / 2;
    this.transitionProgress = 0;
    this.isTransitioning = false;
    this.targetParticles = [];
    this.scale = initialScale;
    scale = initialScale;

    this.canvasEle.addEventListener("mousemove", this.handleMouseMove);
    this.canvasEle.addEventListener("mouseleave", this.handleMouseLeave);
  }

  handleMouseMove = (e: MouseEvent) => {
    const { left, top } = this.canvasEle.getBoundingClientRect();
    this.mouseX = e.clientX - left;
    this.mouseY = e.clientY - top;
  }

  handleMouseLeave = () => {
    this.mouseX = undefined;
    this.mouseY = undefined;
  }

  changeImg(img: LogoImg) {
    if (this.currentLogo && this.currentLogo !== img) {
      this.nextLogo = img;
      this.triggerExitAnimation();
    } else {
      this.loadNewImage(img);
    }
  }

  triggerExitAnimation() {
    this.isExiting = true;
    this.transitionProgress = 0;
    
    this.ParticleArr.forEach(particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 2;
      particle.exitVx = Math.cos(angle) * speed;
      particle.exitVy = Math.sin(angle) * speed;
    });

    setTimeout(() => {
      if (this.nextLogo) {
        this.loadNewImage(this.nextLogo);
        this.nextLogo = null;
      }
    }, this.exitAnimationDuration + this.newImageDelay);
  }

  loadNewImage(img: LogoImg) {
    this.currentLogo = img;
    this.ParticleArr = img.particleData.map(
      (item) => new Particle(item.totalX, item.totalY, animateTime, item.color)
    );
    this.isExiting = false;
  }

  drawCanvas() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;

    this.ctx.clearRect(0, 0, this.width, this.height);
    
    if (this.ParticleArr.length > 0) {
      const particleAreaX = this.particleAreaX;
      const particleAreaY = this.particleAreaY;

      let relativeMouseX = this.mouseX !== undefined ? this.mouseX - particleAreaX : undefined;
      let relativeMouseY = this.mouseY !== undefined ? this.mouseY - particleAreaY : undefined;

      if (this.isTransitioning) {
        this.transitionProgress += deltaTime / 1000;
        if (this.transitionProgress >= 1) {
          this.isTransitioning = false;
          this.ParticleArr = this.targetParticles;
          this.targetParticles = [];
        } else {
          this.ParticleArr.forEach((particle, index) => {
            particle.updateTransition(this.targetParticles[index], this.transitionProgress);
          });
        }
      }

      if (this.isExiting) {
        this.transitionProgress += deltaTime / this.exitAnimationDuration;
        if (this.transitionProgress >= 1) {
          this.ParticleArr = [];
        } else {
          this.ParticleArr.forEach(particle => {
            particle.x += particle.exitVx!;
            particle.y += particle.exitVy!;
            particle.opacity = Math.max(0, 1 - this.transitionProgress);
          });
        }
      } else {
        // 正常更新粒子
        this.ParticleArr.forEach(particle => {
          particle.update(deltaTime, relativeMouseX, relativeMouseY);
        });
      }

      this.ctx.save();
      this.ctx.translate(particleAreaX, particleAreaY);
      
      this.ParticleArr.forEach(particle => {
        particle.draw(this.ctx, this.isGrayscale);
      });

      if (this.debug && this.mouseX !== undefined && this.mouseY !== undefined) {
        this.ctx.beginPath();
        this.ctx.arc(relativeMouseX!, relativeMouseY!, LargeRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(relativeMouseX!, relativeMouseY!, Radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.stroke();
      }

      this.ctx.restore();
    } else if (this.currentLogo && this.currentLogo.particleData.length > 0) {
      // 如果当前没有粒子但有新的 logo 数据，则创建新的粒子
      this.ParticleArr = this.currentLogo.particleData.map(
        (item) => new Particle(item.totalX, item.totalY, animateTime, item.color)
      );
    }

    this.animationFrameId = window.requestAnimationFrame(() => this.drawCanvas());
  }

  toggleDebug() {
    this.debug = !this.debug;
  }

  setGrayscale(isGrayscale: boolean) {
    this.isGrayscale = isGrayscale;
  }

  stop() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.canvasEle.removeEventListener("mousemove", this.handleMouseMove);
    this.canvasEle.removeEventListener("mouseleave", this.handleMouseLeave);
  }

  changeScale(newScale: number) {
    scale = newScale;
    this.ParticleArr.forEach(particle => {
      particle.r = BaseParticleRadius * scale;
    });
  }

  setBrightnessThreshold(threshold: number) {
    brightnessThreshold = Math.max(0, Math.min(255, threshold));
  }

  setAlphaThreshold(threshold: number) {
    alphaThreshold = Math.max(0, Math.min(255, threshold));
  }
}

interface ParticleSystemProps {
  activeLabel?: string;
  width: number;
  height: number;
  isGrayscale: boolean;
  particleAreaX?: number;
  particleAreaY?: number;
  scale?: number;
  brightnessThreshold?: number;
  alphaThreshold?: number;
  debug?: boolean;
}

const ParticleFactory: React.FC<ParticleSystemProps> = ({ 
  activeLabel, 
  width, 
  height, 
  isGrayscale, 
  particleAreaX, 
  particleAreaY,
  scale: initialScale,
  brightnessThreshold: initialBrightnessThreshold,
  alphaThreshold: initialAlphaThreshold,
  debug = false,
}) => {
  const [activeLogo, setActiveLogo] = useState<LogoImg | null>(null);
  const [logoImgs, setLogoImgs] = useState<LogoImg[]>([]);
  const [particleCanvas, setParticleCanvas] = useState<ParticleCanvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<ParticleCanvas | null>(null);

  // 初始化效果
  useEffect(() => {
    const newLogoImgs = logos.map(item => new LogoImg(item.url, item.label));
    setLogoImgs(newLogoImgs);

    if (canvasRef.current) {
      const particleAreaWidth = width / 3;
      const particleAreaHeight = height / 2;

      if (particleCanvas) {
        particleCanvas.stop();
      }

      const newParticleCanvas = new ParticleCanvas(
        canvasRef.current, 
        particleAreaWidth, 
        particleAreaHeight, 
        isGrayscale,
        particleAreaX,
        particleAreaY,
        initialScale
      );
      setParticleCanvas(newParticleCanvas);
      particleCanvasRef.current = newParticleCanvas;
      newParticleCanvas.debug = debug;
      if (initialBrightnessThreshold !== undefined) {
        newParticleCanvas.setBrightnessThreshold(initialBrightnessThreshold);
      }
      if (initialAlphaThreshold !== undefined) {
        newParticleCanvas.setAlphaThreshold(initialAlphaThreshold);
      }
      newParticleCanvas.drawCanvas();

      // 将 ParticleCanvas 实例暴露到全局对象
      (window as any).particleCanvas = newParticleCanvas;

      // 添加控制台指令
      (window as any).changeLogoByLabel = (label: string) => {
        const selectedLogo = newLogoImgs.find(logo => logo.name === label);
        if (selectedLogo) {
          newParticleCanvas.changeImg(selectedLogo);
          console.log(`切换到标签: ${label}`);
        } else {
          console.log(`未找到标签: ${label}`);
        }
      };
    }

    return () => {
      if (particleCanvas) {
        particleCanvas.stop();
      }
      // 清理全局对象
      delete (window as any).particleCanvas;
      delete (window as any).changeLogoByLabel;
    };
  }, [width, height, isGrayscale, particleAreaX, particleAreaY, initialScale, initialBrightnessThreshold, initialAlphaThreshold, debug]);

  // 处理 activeLabel 变化
  useEffect(() => {
    if (activeLabel && logoImgs.length > 0 && particleCanvas) {
      const selectedLogo = logoImgs.find(logo => logo.name === activeLabel);
      if (selectedLogo && selectedLogo.isLoaded) {
        particleCanvas.changeImg(selectedLogo);
      }
    }
  }, [activeLabel, logoImgs, particleCanvas]);

  // 处理 Logo 点击
  const handleLogoClick = (logoItem: LogoImg) => {
    setActiveLogo(logoItem);
    if (particleCanvas) {
      particleCanvas.changeImg(logoItem);
    }
  };

  // 设置 Logo
  useEffect(() => {
    if (logoImgs.length > 0 && particleCanvas) {
      const defaultLogo = logoImgs.find(logo => logo.name === activeLabel);
      if (defaultLogo) {
        handleLogoClick(defaultLogo);
      } else {
        console.log(`logo not found`);
      }
    }
  }, [logoImgs, particleCanvas]);

  // 处理灰度模式变化
  useEffect(() => {
    if (particleCanvas) {
      particleCanvas.setGrayscale(isGrayscale);
    }
  }, [isGrayscale, particleCanvas]);

  // 切换调试模式
  const toggleDebug = () => {
    if (particleCanvas) {
      particleCanvas.toggleDebug();
    }
  };

  return (
    <div className="particle-system" style={{ width: `${width}px`, height: `${height}px` }}>
      <canvas ref={canvasRef} width={width} height={height}></canvas>
    </div>
  );
};

export default ParticleFactory;