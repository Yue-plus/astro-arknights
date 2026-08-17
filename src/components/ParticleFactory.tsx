import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 10_000;
const ORIGINAL_MODEL_SIZE = 800;
const LEGACY_MODEL_SIZE = 400;
const DEFAULT_POINT_SIZE = 3;
const POINTER_INNER_RADIUS = 48;
const POINTER_OUTER_RADIUS = 230;
const POINTER_INNER_FORCE = 3.2;
const POINTER_OUTER_FORCE = 0.16;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const MODEL_NAMES = [
  "arknights",
  "originiums",
  "originium_arts",
  "reunion",
  "infected",
  "nomadic_city",
  "rhodes_island",
] as const;

type ModelName = (typeof MODEL_NAMES)[number];
type ModelPoint = [number, number, number?];

interface ParticleModel {
  count: number;
  size: {
    width: number;
    height: number;
  };
  points: ModelPoint[];
}

interface ParticleSystemProps {
  activeLabel?: string;
  imageUrl?: string;
  width: number;
  height: number;
  isGrayscale: boolean;
  particleAreaX?: number;
  particleAreaY?: number;
  pointSize?: number;
  scale?: number;
}

interface ParticleLayout {
  centerX: number;
  centerY: number;
  modelScale: number;
}

const modelPromises = new Map<ModelName, Promise<ParticleModel>>();
const modelOrders = new WeakMap<ParticleModel, Uint32Array>();

function loadModel(name: ModelName) {
  const cached = modelPromises.get(name);
  if (cached) return cached;

  const base = import.meta.env.BASE_URL;
  const promise = fetch(`${base}world-particles/${name}.json`).then(
    async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load particle model: ${name}`);
      }
      return (await response.json()) as ParticleModel;
    },
  );

  modelPromises.set(name, promise);
  return promise;
}

function resolveModelName(activeLabel?: string, imageUrl?: string): ModelName {
  if (imageUrl) {
    const fileName = imageUrl.split("/").pop()?.replace(/\.[^.]+$/, "");
    if (MODEL_NAMES.includes(fileName as ModelName)) {
      return fileName as ModelName;
    }
  }

  if (activeLabel === "island" || activeLabel === "rhodes") {
    return "rhodes_island";
  }

  if (MODEL_NAMES.includes(activeLabel as ModelName)) {
    return activeLabel as ModelName;
  }

  return "arknights";
}

function createShuffledOrder(length: number, seed: number) {
  const order = new Uint32Array(length);
  for (let index = 0; index < length; index += 1) order[index] = index;

  let state = seed || 1;
  const random = () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };

  for (let index = length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    const value = order[index];
    order[index] = order[target];
    order[target] = value;
  }

  return order;
}

function getModelOrder(model: ParticleModel) {
  const cached = modelOrders.get(model);
  if (cached) return cached;

  const order = createShuffledOrder(
    Math.min(model.count, model.points.length, PARTICLE_COUNT),
    model.count * 2_654_435_761,
  );
  modelOrders.set(model, order);
  return order;
}

class WorldParticleSystem {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.OrthographicCamera;
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.ShaderMaterial;
  private readonly points: THREE.Points;

  private readonly positions = new Float32Array(PARTICLE_COUNT * 3);
  private readonly colors = new Float32Array(PARTICLE_COUNT * 4);
  private readonly targetPositions = new Float32Array(PARTICLE_COUNT * 3);
  private readonly targetAlpha = new Float32Array(PARTICLE_COUNT);
  private readonly speeds = new Float32Array(PARTICLE_COUNT);

  private readonly positionAttribute: THREE.BufferAttribute;
  private readonly colorAttribute: THREE.BufferAttribute;
  private readonly pointSizeUniform: { value: number };

  private width: number;
  private height: number;
  private pixelRatio = 1;
  private activeCount = 0;
  private transitionCount = 0;
  private currentModel: ParticleModel | null = null;
  private currentOrder: Uint32Array | null = null;
  private transitionPhase = 0;
  private layout: ParticleLayout;
  private animationFrameId: number | null = null;
  private lastUpdateTime = performance.now();
  private pointerX = 0;
  private pointerY = 0;
  private pointerActive = false;
  private pointSize: number;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    layout: ParticleLayout,
    pointSize: number,
  ) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.layout = layout;
    this.pointSize = pointSize;

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const positionIndex = index * 3;
      const colorIndex = index * 4;

      this.positions[positionIndex] = (Math.random() - 0.5) * width;
      this.positions[positionIndex + 1] = (Math.random() - 0.5) * height;
      this.positions[positionIndex + 2] = (Math.random() - 0.5) * 500;

      this.targetPositions[positionIndex] = this.positions[positionIndex];
      this.targetPositions[positionIndex + 1] = this.positions[positionIndex + 1];
      this.targetPositions[positionIndex + 2] = 0;

      this.colors[colorIndex] = 1;
      this.colors[colorIndex + 1] = 1;
      this.colors[colorIndex + 2] = 1;
      this.colors[colorIndex + 3] = 0;
      this.targetAlpha[index] = 0;
      this.speeds[index] = 20 + Math.random() * 10;
    }

    this.positionAttribute = new THREE.BufferAttribute(this.positions, 3);
    this.positionAttribute.setUsage(THREE.DynamicDrawUsage);
    this.colorAttribute = new THREE.BufferAttribute(this.colors, 4);
    this.colorAttribute.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute("position", this.positionAttribute);
    this.geometry.setAttribute("color", this.colorAttribute);

    this.pointSizeUniform = { value: pointSize };
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uPointSize: this.pointSizeUniform,
      },
      vertexShader: `
        attribute vec4 color;
        varying vec4 vColor;
        uniform float uPointSize;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uPointSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec4 vColor;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          if (distanceToCenter > 0.5 || vColor.a <= 0.0) discard;

          float edgeAlpha = 1.0 - smoothstep(0.32, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor.rgb, vColor.a * edgeAlpha);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      -1_000,
      1_000,
    );
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);

    this.canvas.addEventListener("pointermove", this.handlePointerMove, {
      passive: true,
    });
    this.canvas.addEventListener("pointerleave", this.handlePointerLeave, {
      passive: true,
    });

    this.resize(width, height);
    this.animationFrameId = requestAnimationFrame(this.update);
  }

  setModel(model: ParticleModel) {
    const previousCount = this.activeCount;

    this.currentModel = model;
    this.activeCount = Math.min(model.count, model.points.length, PARTICLE_COUNT);
    this.transitionCount = Math.max(
      this.transitionCount,
      previousCount,
      this.activeCount,
    );
    this.currentOrder = getModelOrder(model);
    this.transitionPhase = Math.random() * Math.PI * 2;
    this.applyModelTargets();

    if (this.activeCount > previousCount) {
      const addedCount = this.activeCount - previousCount;

      for (let index = previousCount; index < this.activeCount; index += 1) {
        const positionIndex = index * 3;
        const colorIndex = index * 4;
        const [x, y, z] = this.getRingPosition(index - previousCount, addedCount);

        this.positions[positionIndex] = x;
        this.positions[positionIndex + 1] = y;
        this.positions[positionIndex + 2] = z;
        this.colors[colorIndex + 3] = 0;
      }
    }
  }

  setLayout(layout: ParticleLayout) {
    this.layout = layout;
    this.applyModelTargets();
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.pointSizeUniform.value = this.pointSize * this.pixelRatio;

    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();
    this.applyModelTargets();
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerleave", this.handlePointerLeave);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }

  setPointSize(pointSize: number) {
    this.pointSize = pointSize;
    this.pointSizeUniform.value = pointSize * this.pixelRatio;
  }

  private applyModelTargets() {
    if (!this.currentModel || !this.currentOrder) return;

    const { centerX, centerY, modelScale } = this.layout;
    const sceneCenterX = centerX - this.width / 2;
    const sceneCenterY = this.height / 2 - centerY;
    const modelCenterX = this.currentModel.size.width / 2;
    const modelCenterY = this.currentModel.size.height / 2;

    for (let index = 0; index < this.activeCount; index += 1) {
      const point = this.currentModel.points[this.currentOrder[index]];
      const positionIndex = index * 3;

      this.targetPositions[positionIndex] =
        sceneCenterX + (point[0] - modelCenterX) * modelScale;
      this.targetPositions[positionIndex + 1] =
        sceneCenterY + (modelCenterY - point[1]) * modelScale;
      this.targetPositions[positionIndex + 2] = 0;
      this.targetAlpha[index] = (point[2] ?? 255) / 255;
    }

    const outgoingCount = Math.max(this.transitionCount, this.activeCount);
    const retiredCount = outgoingCount - this.activeCount;

    for (let index = this.activeCount; index < outgoingCount; index += 1) {
      const positionIndex = index * 3;
      const [x, y, z] = this.getRingPosition(
        index - this.activeCount,
        retiredCount,
      );

      this.targetPositions[positionIndex] = x;
      this.targetPositions[positionIndex + 1] = y;
      this.targetPositions[positionIndex + 2] = z;
      this.targetAlpha[index] = 0;
    }

    for (let index = outgoingCount; index < PARTICLE_COUNT; index += 1) {
      this.targetAlpha[index] = 0;
    }
  }

  private getRingPosition(index: number, count: number) {
    if (!this.currentModel) return [0, 0, 0] as const;

    const { centerX, centerY, modelScale } = this.layout;
    const sceneCenterX = centerX - this.width / 2;
    const sceneCenterY = this.height / 2 - centerY;
    const normalizedIndex = index / Math.max(count, 1);
    const angle =
      this.transitionPhase + index * GOLDEN_ANGLE + normalizedIndex * Math.PI;
    const band = 0.72 + ((index * 73) % 17) / 100;
    const radius =
      Math.max(this.currentModel.size.width, this.currentModel.size.height) *
      modelScale *
      band;

    return [
      sceneCenterX + Math.cos(angle) * radius,
      sceneCenterY + Math.sin(angle) * radius,
      Math.sin(angle * 3) * 70,
    ] as const;
  }

  private handlePointerMove = (event: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerX = event.clientX - rect.left - rect.width / 2;
    this.pointerY = rect.height / 2 - (event.clientY - rect.top);
    this.pointerActive = true;
  };

  private handlePointerLeave = () => {
    this.pointerActive = false;
  };

  private update = (currentTime: number) => {
    const deltaTime = Math.min((currentTime - this.lastUpdateTime) / 1_000, 0.05);
    const frameScale = deltaTime * 60;
    this.lastUpdateTime = currentTime;

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const positionIndex = index * 3;
      const colorIndex = index * 4;
      const easing = Math.min(frameScale / this.speeds[index], 0.25);

      let pointerOffsetX = 0;
      let pointerOffsetY = 0;

      if (this.pointerActive && index < this.activeCount) {
        const deltaX = this.pointerX - this.positions[positionIndex];
        const deltaY = this.pointerY - this.positions[positionIndex + 1];
        const distance = Math.max(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 1);
        const innerPressure =
          Math.exp(
            -(distance * distance) /
              (2 * POINTER_INNER_RADIUS * POINTER_INNER_RADIUS),
          ) * POINTER_INNER_FORCE;
        const outerPressure =
          Math.exp(
            -(distance * distance) /
              (2 * POINTER_OUTER_RADIUS * POINTER_OUTER_RADIUS),
          ) * POINTER_OUTER_FORCE;
        const pressure = (innerPressure + outerPressure) * frameScale;

        pointerOffsetX = (-deltaX / distance) * pressure;
        pointerOffsetY = (-deltaY / distance) * pressure;
      }

      this.positions[positionIndex] +=
        (this.targetPositions[positionIndex] - this.positions[positionIndex]) *
          easing +
        pointerOffsetX;
      this.positions[positionIndex + 1] +=
        (this.targetPositions[positionIndex + 1] -
          this.positions[positionIndex + 1]) *
          easing +
        pointerOffsetY;
      this.positions[positionIndex + 2] +=
        (this.targetPositions[positionIndex + 2] -
          this.positions[positionIndex + 2]) *
        easing;
      this.colors[colorIndex + 3] +=
        (this.targetAlpha[index] - this.colors[colorIndex + 3]) * easing;
    }

    this.positionAttribute.needsUpdate = true;
    this.colorAttribute.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.update);
  };
}

export default function ParticleFactory({
  activeLabel,
  imageUrl,
  width,
  height,
  particleAreaX,
  particleAreaY,
  pointSize = DEFAULT_POINT_SIZE,
  scale = 1.7,
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<WorldParticleSystem | null>(null);
  const modelName = useMemo(
    () => resolveModelName(activeLabel, imageUrl),
    [activeLabel, imageUrl],
  );
  const layout = useMemo<ParticleLayout>(
    () => ({
      centerX: (particleAreaX ?? width / 2 - LEGACY_MODEL_SIZE / 2) + 200,
      centerY: (particleAreaY ?? height / 2 - LEGACY_MODEL_SIZE / 2) + 200,
      modelScale: (scale * LEGACY_MODEL_SIZE) / ORIGINAL_MODEL_SIZE,
    }),
    [height, particleAreaX, particleAreaY, scale, width],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const particleSystem = new WorldParticleSystem(
      canvas,
      width,
      height,
      layout,
      pointSize,
    );
    particleSystemRef.current = particleSystem;

    for (const name of MODEL_NAMES) void loadModel(name);

    return () => {
      particleSystem.destroy();
      particleSystemRef.current = null;
    };
  }, []);

  useEffect(() => {
    particleSystemRef.current?.resize(width, height);
  }, [height, width]);

  useEffect(() => {
    particleSystemRef.current?.setLayout(layout);
  }, [layout]);

  useEffect(() => {
    particleSystemRef.current?.setPointSize(pointSize);
  }, [pointSize]);

  useEffect(() => {
    let cancelled = false;

    loadModel(modelName)
      .then((model) => {
        if (!cancelled) particleSystemRef.current?.setModel(model);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [modelName]);

  return (
    <div
      className="particle-system"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
