"use client";

import { useMemo, useRef, useLayoutEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Sky,
  Clouds,
  Cloud,
  Sparkles,
  MeshReflectorMaterial,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  GodRays,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import gsap from "gsap";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Window light field — instanced for performance                    */
/* ------------------------------------------------------------------ */

interface WindowGridProps {
  width: number;
  depth: number;
  height: number;
  baseY: number;
  cols: number;
  rows: number;
}

function InstancedWindows({ width, depth, height, baseY, cols, rows }: WindowGridProps) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const warm = useMemo(() => new THREE.Color("#ffcf8a"), []);
  const cool = useMemo(() => new THREE.Color("#bfe0ff"), []);

  const instances = useMemo(() => {
    const list: { pos: THREE.Vector3; rotY: number; color: THREE.Color; lit: number }[] = [];
    const usableW = width * 0.76;
    const usableD = depth * 0.76;
    const usableH = height * 0.9;
    const startY = baseY + height * 0.06;

    const faces = [
      { axis: "z", span: usableW, off: depth / 2 + 0.02, rotY: 0 },
      { axis: "z", span: usableW, off: -(depth / 2 + 0.02), rotY: Math.PI },
      { axis: "x", span: usableD, off: width / 2 + 0.02, rotY: Math.PI / 2 },
      { axis: "x", span: usableD, off: -(width / 2 + 0.02), rotY: -Math.PI / 2 },
    ] as const;

    for (const face of faces) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const u = cols === 1 ? 0 : c / (cols - 1) - 0.5;
          const v = rows === 1 ? 0 : r / (rows - 1) - 0.5;
          const along = u * face.span;
          const y = startY + (v + 0.5) * usableH;
          const pos =
            face.axis === "z"
              ? new THREE.Vector3(along, y, face.off)
              : new THREE.Vector3(face.off, y, along);
          const lit = Math.random();
          list.push({
            pos,
            rotY: face.rotY,
            color: Math.random() > 0.5 ? warm : cool,
            lit: lit > 0.42 ? lit : 0,
          });
        }
      }
    }
    return list;
  }, [width, depth, height, baseY, cols, rows, warm, cool]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    const dummy = new THREE.Object3D();
    instances.forEach((inst, i) => {
      dummy.position.copy(inst.pos);
      dummy.rotation.set(0, inst.rotY, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const c = inst.color.clone().multiplyScalar(inst.lit > 0 ? 1 : 0.06);
      mesh.setColorAt(i, c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [instances]);

  const twinkle = useRef(0);
  useFrame((_, dt) => {
    twinkle.current += dt;
    if (twinkle.current < 0.4) return;
    twinkle.current = 0;
    const mesh = ref.current;
    for (let k = 0; k < 6; k++) {
      const i = Math.floor(Math.random() * instances.length);
      const inst = instances[i];
      const on = Math.random() > 0.5;
      const c = inst.color.clone().multiplyScalar(on ? 1 : 0.06);
      mesh.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, instances.length]} frustumCulled={false}>
      <planeGeometry args={[1.0, 1.4]} />
      <meshStandardMaterial
        emissive={"#ffffff"}
        emissiveIntensity={2.4}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  The hero skyscraper                                                */
/* ------------------------------------------------------------------ */

function Skyscraper() {
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d1f38",
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 1.4,
      }),
    []
  );
  const frame = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1b2c4a",
        metalness: 0.9,
        roughness: 0.35,
      }),
    []
  );

  return (
    <group>
      <mesh position={[0, 11, 0]} material={glass} castShadow receiveShadow>
        <boxGeometry args={[13, 22, 13]} />
      </mesh>
      <InstancedWindows width={13} depth={13} height={22} baseY={0} cols={7} rows={11} />

      <mesh position={[0, 31, 0]} material={glass} castShadow receiveShadow>
        <boxGeometry args={[10, 18, 10]} />
      </mesh>
      <InstancedWindows width={10} depth={10} height={18} baseY={22} cols={6} rows={9} />

      <mesh position={[0, 47, 0]} material={glass} castShadow receiveShadow>
        <boxGeometry args={[7, 14, 7]} />
      </mesh>
      <InstancedWindows width={7} depth={7} height={14} baseY={40} cols={4} rows={7} />

      <mesh position={[0, 56, 0]} material={frame} castShadow>
        <boxGeometry args={[4.4, 6, 4.4]} />
      </mesh>
      <mesh position={[0, 61.5, 0]} material={frame}>
        <cylinderGeometry args={[0.18, 0.18, 9, 8]} />
      </mesh>
      <mesh position={[0, 66, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial emissive={"#ff5a4d"} emissiveIntensity={5} color="#ff5a4d" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 66, 0]} color="#ff5a4d" intensity={6} distance={20} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Skyline of background towers                                       */
/* ------------------------------------------------------------------ */

function Skyline() {
  const towers = useMemo(() => {
    const arr: { x: number; z: number; w: number; d: number; h: number }[] = [];
    const rng = (seed: number) => {
      const x = Math.sin(seed * 99.13) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < 26; i++) {
      const ang = (i / 26) * Math.PI * 2 + rng(i) * 0.4;
      const rad = 34 + rng(i * 3) * 40;
      arr.push({
        x: Math.cos(ang) * rad,
        z: Math.sin(ang) * rad,
        w: 5 + rng(i * 7) * 6,
        d: 5 + rng(i * 11) * 6,
        h: 14 + rng(i * 5) * 46,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {towers.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2, t.z]} castShadow>
          <boxGeometry args={[t.w, t.h, t.d]} />
          <meshStandardMaterial
            color="#0a1626"
            metalness={0.8}
            roughness={0.25}
            emissive="#162238"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Reflective ground                                                  */
/* ------------------------------------------------------------------ */

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <MeshReflectorMaterial
        resolution={1024}
        mixBlur={1}
        mixStrength={6}
        blur={[400, 100]}
        roughness={0.9}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#070d18"
        metalness={0.7}
        mirror={0.45}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Atmosphere — moving clouds + particles                            */
/* ------------------------------------------------------------------ */

function Atmosphere() {
  const cloudsRef = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.0125;
  });

  return (
    <group ref={cloudsRef}>
      <Clouds material={THREE.MeshBasicMaterial} limit={300} range={120}>
        <Cloud seed={1} segments={42} bounds={[60, 8, 60]} volume={26} color="#ffd6ad" fade={120} speed={0.2} opacity={0.45} position={[-8, 44, -28]} />
        <Cloud seed={7} segments={36} bounds={[55, 6, 55]} volume={22} color="#cfe2ff" fade={120} speed={0.14} opacity={0.35} position={[18, 54, -10]} />
        <Cloud seed={13} segments={30} bounds={[40, 5, 40]} volume={16} color="#ffe9d2" fade={140} speed={0.22} opacity={0.3} position={[0, 30, 22]} />
      </Clouds>

      <Sparkles count={140} scale={[120, 18, 120]} position={[0, 8, 0]} size={6} speed={0.25} opacity={0.25} color="#ffd9b0" />
      <Sparkles count={260} scale={[80, 70, 80]} position={[0, 36, 0]} size={2.4} speed={0.35} opacity={0.6} color="#fff3df" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Sun system — animated sunrise + provides sun mesh for god rays     */
/* ------------------------------------------------------------------ */

interface SunSystemProps {
  onSun: (mesh: THREE.Mesh) => void;
}

function SunSystem({ onSun }: SunSystemProps) {
  const skyRef = useRef<THREE.Mesh>(null!);
  const dirRef = useRef<THREE.DirectionalLight>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);
  const sunMat = useRef<THREE.MeshBasicMaterial>(null!);
  const { gl } = useThree();

  const progress = useRef({ t: 0 });

  const colDawn = useMemo(() => new THREE.Color("#ff7a3c"), []);
  const colDay = useMemo(() => new THREE.Color("#fff1da"), []);
  const sunDawn = useMemo(() => new THREE.Color("#ff5e2c"), []);
  const sunDay = useMemo(() => new THREE.Color("#fff4dc"), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const sunPos = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    if (sunRef.current) onSun(sunRef.current);
    const tween = gsap.to(progress.current, {
      t: 1,
      duration: 18,
      ease: "power2.inOut",
      delay: 0.5,
    });
    return () => {
      tween.kill();
    };
  }, [onSun]);

  useFrame(() => {
    const t = progress.current.t;

    const elev = THREE.MathUtils.lerp(1.5, 24, t);
    const azim = THREE.MathUtils.lerp(-72, -34, t);
    const phi = THREE.MathUtils.degToRad(90 - elev);
    const theta = THREE.MathUtils.degToRad(azim);
    const dist = 130;
    sunPos.set(
      dist * Math.sin(phi) * Math.cos(theta),
      dist * Math.cos(phi),
      dist * Math.sin(phi) * Math.sin(theta)
    );

    if (skyRef.current) {
      const mat = skyRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.sunPosition.value.copy(sunPos);
    }

    if (dirRef.current) {
      dirRef.current.position.copy(sunPos);
      dirRef.current.intensity = THREE.MathUtils.lerp(1.4, 3.6, t);
      tmp.lerpColors(colDawn, colDay, t);
      dirRef.current.color.copy(tmp);
    }

    if (sunRef.current && sunMat.current) {
      sunRef.current.position.copy(sunPos).multiplyScalar(0.62);
      tmp.lerpColors(sunDawn, sunDay, t);
      sunMat.current.color.copy(tmp);
    }

    gl.toneMappingExposure = THREE.MathUtils.lerp(0.68, 1.12, t);
  });

  return (
    <>
      <Sky
        ref={skyRef}
        distance={450000}
        sunPosition={[60, 4, -90]}
        turbidity={9}
        rayleigh={3.4}
        mieCoefficient={0.025}
        mieDirectionalG={0.9}
      />
      <directionalLight
        ref={dirRef}
        castShadow
        intensity={1.4}
        color="#ff7a3c"
        shadow-mapSize={[1536, 1536]}
        shadow-camera-near={1}
        shadow-camera-far={320}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={120}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0004}
      />
      {/* Visible sun disc (also sampled by GodRays) */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[7, 32, 32]} />
        <meshBasicMaterial ref={sunMat} color="#ff5e2c" toneMapped={false} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient / fill lighting + reflections                             */
/* ------------------------------------------------------------------ */

function FillLighting() {
  return (
    <>
      <hemisphereLight args={["#ffd9a8", "#0a1020", 0.5]} />
      <directionalLight position={[-50, 30, 60]} intensity={0.55} color="#7fa8ff" />
      <Environment resolution={256}>
        <group rotation={[0, Math.PI / 3, 0]}>
          <Lightformer form="rect" intensity={6} color="#ffb066" position={[20, 8, -20]} scale={[30, 18, 1]} />
          <Lightformer form="rect" intensity={2} color="#86b3ff" position={[-24, 14, 18]} scale={[24, 16, 1]} />
          <Lightformer form="ring" intensity={3} color="#ffe3c2" position={[0, 30, -40]} scale={[20, 20, 1]} />
        </group>
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Cinematic camera — GSAP intro + orbit + mouse parallax            */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera, pointer } = useThree();
  const cam = useRef({ radius: 95, theta: -1.35, height: 58, lookY: 30, fov: 50 });
  const px = useRef(0);
  const py = useRef(0);

  useLayoutEffect(() => {
    const c = cam.current;
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = c.fov;
    persp.updateProjectionMatrix();

    const tl = gsap.timeline();
    tl.to(c, { radius: 38, height: 20, theta: 0.25, lookY: 22, fov: 42, duration: 4.2, ease: "power3.inOut" })
      .to(c, { height: 26, lookY: 26, duration: 3, ease: "sine.inOut" }, ">-0.3")
      .add(() => {
        gsap.to(c, { theta: "+=" + Math.PI * 2, duration: 48, ease: "none", repeat: -1 });
        gsap.to(c, { radius: 44, height: 22, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

    return () => {
      tl.kill();
      gsap.killTweensOf(c);
    };
  }, [camera]);

  useFrame(() => {
    const c = cam.current;
    px.current += (pointer.x - px.current) * 0.04;
    py.current += (pointer.y - py.current) * 0.04;

    const x = Math.sin(c.theta) * c.radius + px.current * 4;
    const z = Math.cos(c.theta) * c.radius;
    const y = c.height + py.current * 3;

    camera.position.set(x, y, z);
    camera.lookAt(0, c.lookY, 0);

    const persp = camera as THREE.PerspectiveCamera;
    if (Math.abs(persp.fov - c.fov) > 0.01) {
      persp.fov = c.fov;
      persp.updateProjectionMatrix();
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Postprocessing — god rays, bloom, DOF, vignette                   */
/* ------------------------------------------------------------------ */

function Effects({ sun, quality }: { sun: THREE.Mesh | null; quality: "high" | "low" }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {sun ? (
        <GodRays
          sun={sun}
          blendFunction={BlendFunction.SCREEN}
          samples={quality === "high" ? 60 : 30}
          density={0.96}
          decay={0.93}
          weight={0.5}
          exposure={0.45}
          clampMax={1}
          kernelSize={KernelSize.SMALL}
          blur
        />
      ) : (
        <></>
      )}
      <Bloom
        intensity={quality === "high" ? 0.95 : 0.6}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.18}
        mipmapBlur
        radius={0.7}
      />
      {quality === "high" ? (
        <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={4.5} height={480} />
      ) : (
        <></>
      )}
      <Vignette blendFunction={BlendFunction.NORMAL} eskil={false} offset={0.18} darkness={0.92} />
      <SMAA />
    </EffectComposer>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene root                                                         */
/* ------------------------------------------------------------------ */

export default function SkyscraperScene() {
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [sun, setSun] = useState<THREE.Mesh | null>(null);

  const handleSun = useCallback((mesh: THREE.Mesh) => setSun(mesh), []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.68,
      }}
      camera={{ position: [80, 50, 80], fov: 50, near: 0.5, far: 1200 }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={["#10182b"]} />
      <fogExp2 attach="fog" args={["#e9c9a6", 0.0085]} />

      <PerformanceMonitor onDecline={() => setQuality("low")} onIncline={() => setQuality("high")} />

      <SunSystem onSun={handleSun} />
      <FillLighting />
      <Skyscraper />
      <Skyline />
      <Ground />
      <Atmosphere />

      <CameraRig />

      <Effects sun={sun} quality={quality} />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
