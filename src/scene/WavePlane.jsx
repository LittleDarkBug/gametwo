import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#000000'),
    uColorEnd: new THREE.Color('#00f3ff'),
    uSources: new Float32Array(30), // 10 sources * 3 (x, y, freq)
    uSourceCount: 0
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uSources[10];
    uniform int uSourceCount;

    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      float elevation = 0.0;
      
      // Wave Logic (Vertex Displacement)
      for(int i = 0; i < 10; i++) {
        if(i >= uSourceCount) break;
        
        vec3 source = uSources[i];
        // Map source 0..1 to world coordinates (-5..5 roughly)
        // Plane is 10x10 centered at 0
        vec2 sourcePos = (vec2(source.x, source.y) - 0.5) * 10.0;
        // NO FLIP: y=0 -> z=-5 (Top/Far), y=1 -> z=5 (Bottom/Near)
        
        float dist = distance(modelPosition.xz, sourcePos);
        float freq = source.z;
        
        float wave = sin(dist * 4.0 * freq - uTime * 3.0);
        float attenuation = 1.0 / (1.0 + dist * 1.5);
        
        elevation += wave * attenuation;
      }

      modelPosition.y += elevation * 0.5; // Scale height
      vElevation = elevation;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;

    void main() {
      float mixStrength = (vElevation + 0.25) * 2.0;
      vec3 color = mix(uColorStart, uColorEnd, mixStrength);
      
      // Grid effect
      float grid = step(0.98, fract(vUv.x * 50.0)) + step(0.98, fract(vUv.y * 50.0));
      color += vec3(grid * 0.2);

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ WaveShaderMaterial })

export function WavePlane({ sources, onPointerDown }) {
  const materialRef = useRef()

  // Convert sources to flat array for uniform
  const sourcesUniform = useMemo(() => {
    const arr = new Float32Array(30)
    sources.forEach((s, i) => {
      arr[i * 3] = s.x
      arr[i * 3 + 1] = s.y
      arr[i * 3 + 2] = s.freq
    })
    return arr
  }, [sources])

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta
      materialRef.current.uSources = sourcesUniform
      materialRef.current.uSourceCount = sources.length
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerDown={onPointerDown}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <waveShaderMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}
