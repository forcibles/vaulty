import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const VOID_COLOR = "#050505";
const GOLD_HINT = new THREE.Color("#FFD700");
const DUST_COUNT = 72;
const DUST_BOUNDS = { x: 14, y: 10, z: 6 };
const DUST_UPDATE_INTERVAL = 1 / 30;

type RayConfig = {
  basePosition: [number, number, number];
  size: [number, number];
  baseRotation: number;
  rotateSpeed: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  baseOpacity: number;
  pulseAmplitude: number;
  pulseSpeed: number;
  phase: number;
  tint: number;
};

const RAY_CONFIGS: RayConfig[] = [
  {
    basePosition: [0.2, -0.1, -1.8],
    size: [16, 2.8],
    baseRotation: -0.52,
    rotateSpeed: 0.02,
    driftSpeedX: 0.09,
    driftSpeedY: 0.07,
    driftAmpX: 0.85,
    driftAmpY: 0.32,
    baseOpacity: 0.12,
    pulseAmplitude: 0.03,
    pulseSpeed: 0.42,
    phase: 0.0,
    tint: 0.08,
  },
  {
    basePosition: [-0.8, 0.45, -1.4],
    size: [14, 2.1],
    baseRotation: 0.68,
    rotateSpeed: -0.016,
    driftSpeedX: 0.06,
    driftSpeedY: 0.1,
    driftAmpX: 0.7,
    driftAmpY: 0.28,
    baseOpacity: 0.1,
    pulseAmplitude: 0.025,
    pulseSpeed: 0.35,
    phase: 1.4,
    tint: 0.12,
  },
  {
    basePosition: [1.1, 0.15, -2.2],
    size: [18, 2.4],
    baseRotation: 1.02,
    rotateSpeed: 0.013,
    driftSpeedX: 0.08,
    driftSpeedY: 0.05,
    driftAmpX: 0.9,
    driftAmpY: 0.34,
    baseOpacity: 0.08,
    pulseAmplitude: 0.02,
    pulseSpeed: 0.3,
    phase: 2.5,
    tint: 0.1,
  },
  {
    basePosition: [-0.15, -0.55, -1.1],
    size: [13, 1.9],
    baseRotation: -1.1,
    rotateSpeed: 0.018,
    driftSpeedX: 0.07,
    driftSpeedY: 0.09,
    driftAmpX: 0.6,
    driftAmpY: 0.25,
    baseOpacity: 0.075,
    pulseAmplitude: 0.018,
    pulseSpeed: 0.38,
    phase: 0.8,
    tint: 0.06,
  },
];

function createRayTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fallback = new THREE.Texture();
    fallback.needsUpdate = true;
    return fallback;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const horizontal = ctx.createLinearGradient(0, 0, canvas.width, 0);
  horizontal.addColorStop(0.0, "rgba(255,255,255,0)");
  horizontal.addColorStop(0.4, "rgba(250,250,250,0.08)");
  horizontal.addColorStop(0.5, "rgba(255,245,220,0.2)");
  horizontal.addColorStop(0.6, "rgba(250,250,250,0.08)");
  horizontal.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = horizontal;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const verticalMask = ctx.createLinearGradient(0, 0, 0, canvas.height);
  verticalMask.addColorStop(0.0, "rgba(0,0,0,0)");
  verticalMask.addColorStop(0.5, "rgba(0,0,0,1)");
  verticalMask.addColorStop(1.0, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = verticalMask;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createDustSpriteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallback = new THREE.Texture();
    fallback.needsUpdate = true;
    return fallback;
  }

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function createNoiseDataUrl(size = 128) {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const value = Math.floor(Math.random() * 255);
    const alpha = 20 + Math.floor(Math.random() * 40);
    imageData.data[i] = value;
    imageData.data[i + 1] = value;
    imageData.data[i + 2] = value;
    imageData.data[i + 3] = alpha;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

function Rays({ texture }: { texture: THREE.Texture }) {
  const meshesRef = useRef<Array<THREE.Mesh | null>>([]);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const rayColors = useMemo(
    () =>
      RAY_CONFIGS.map((config) =>
        new THREE.Color("#f6f6f6").lerp(GOLD_HINT, config.tint),
      ),
    [],
  );
  const materials = useMemo(
    () =>
      RAY_CONFIGS.map(
        (config, index) =>
          new THREE.MeshBasicMaterial({
            map: texture,
            color: rayColors[index],
            transparent: true,
            opacity: config.baseOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
          }),
      ),
    [rayColors, texture],
  );

  useEffect(() => {
    return () => {
      planeGeometry.dispose();
      materials.forEach((material) => material.dispose());
    };
  }, [materials, planeGeometry]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < RAY_CONFIGS.length; i += 1) {
      const mesh = meshesRef.current[i];
      if (!mesh) continue;

      const config = RAY_CONFIGS[i];
      mesh.rotation.z = config.baseRotation + t * config.rotateSpeed;
      mesh.position.x =
        config.basePosition[0] +
        Math.sin(t * config.driftSpeedX + config.phase) * config.driftAmpX;
      mesh.position.y =
        config.basePosition[1] +
        Math.cos(t * config.driftSpeedY + config.phase) * config.driftAmpY;
      materials[i].opacity =
        config.baseOpacity +
        Math.sin(t * config.pulseSpeed + config.phase) * config.pulseAmplitude;
    }
  });

  return (
    <group>
      {RAY_CONFIGS.map((config, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            meshesRef.current[index] = mesh;
          }}
          geometry={planeGeometry}
          material={materials[index]}
          scale={[config.size[0], config.size[1], 1]}
          position={config.basePosition}
          rotation={[0, 0, config.baseRotation]}
        />
      ))}
    </group>
  );
}

function DustMotes({ texture }: { texture: THREE.Texture }) {
  const pointsRef = useRef<THREE.Points>(null);
  const tickAccumulator = useRef(0);
  const { geometry, positionAttribute, positions, speed, phase } = useMemo(() => {
    const initialPositions = new Float32Array(DUST_COUNT * 3);
    const initialSpeed = new Float32Array(DUST_COUNT);
    const initialPhase = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i += 1) {
      const idx = i * 3;
      initialPositions[idx] = THREE.MathUtils.randFloatSpread(DUST_BOUNDS.x);
      initialPositions[idx + 1] = THREE.MathUtils.randFloatSpread(DUST_BOUNDS.y);
      initialPositions[idx + 2] = THREE.MathUtils.randFloatSpread(DUST_BOUNDS.z);
      initialSpeed[i] = THREE.MathUtils.randFloat(0.035, 0.085);
      initialPhase[i] = Math.random() * Math.PI * 2;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    const attribute = new THREE.BufferAttribute(initialPositions, 3);
    pointsGeometry.setAttribute("position", attribute);

    return {
      geometry: pointsGeometry,
      positionAttribute: attribute,
      positions: initialPositions,
      speed: initialSpeed,
      phase: initialPhase,
    };
  }, []);
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: texture,
        color: "#ece8df",
        transparent: true,
        opacity: 0.16,
        size: 0.08,
        sizeAttenuation: true,
        alphaTest: 0.01,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [texture],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }, delta) => {
    tickAccumulator.current += delta;
    if (tickAccumulator.current < DUST_UPDATE_INTERVAL) return;

    const step = tickAccumulator.current;
    tickAccumulator.current = 0;
    const array = positions;
    const t = clock.elapsedTime;
    const horizontalDrift = step * 0.16;

    for (let i = 0; i < DUST_COUNT; i += 1) {
      const idx = i * 3;
      array[idx + 1] += speed[i] * step;
      array[idx] += Math.sin(t * 0.32 + phase[i]) * horizontalDrift;

      if (array[idx + 1] > DUST_BOUNDS.y * 0.5) {
        array[idx + 1] = -DUST_BOUNDS.y * 0.5;
        array[idx] = THREE.MathUtils.randFloatSpread(DUST_BOUNDS.x);
        array[idx + 2] = THREE.MathUtils.randFloatSpread(DUST_BOUNDS.z);
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points
      ref={pointsRef}
      frustumCulled={false}
      geometry={geometry}
      material={material}
    />
  );
}

function Scene() {
  const rayTexture = useMemo(createRayTexture, []);
  const dustTexture = useMemo(createDustSpriteTexture, []);

  useEffect(() => {
    return () => {
      rayTexture.dispose();
      dustTexture.dispose();
    };
  }, [dustTexture, rayTexture]);

  return (
    <>
      <color attach="background" args={[VOID_COLOR]} />
      <fog attach="fog" args={[VOID_COLOR, 9, 24]} />
      <Rays texture={rayTexture} />
      <DustMotes texture={dustTexture} />
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function VolumetricBackground() {
  const noiseTextureUrl = useMemo(() => createNoiseDataUrl(128), []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 48, near: 0.1, far: 40 }}
        dpr={[0.75, 1.25]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: false,
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: noiseTextureUrl ? `url(${noiseTextureUrl})` : undefined,
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
          opacity: 0.12,
          mixBlendMode: "soft-light",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(5,5,5,0) 35%, rgba(5,5,5,0.6) 100%)",
        }}
      />
    </div>
  );
}
