import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'

export function Arena() {
    const gridRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (gridRef.current) {
            // Moving grid effect
            gridRef.current.position.z = (t * 2) % 2
        }
    })

    return (
        <group>
            {/* Floor Grid */}
            <gridHelper
                ref={gridRef}
                args={[100, 100, 0xff00ff, 0x220044]}
                position={[0, -2, 0]}
            />

            {/* Reflective Floor Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#050510"
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>

            {/* Ambient Particles */}
            <Sparkles
                count={200}
                scale={[20, 10, 20]}
                size={4}
                speed={0.4}
                opacity={0.5}
                color="#00f3ff"
            />

            {/* Neon Pillars */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <NeonPillar position={[-8, 0, -10]} color="#ff00ff" />
                <NeonPillar position={[8, 0, -10]} color="#00f3ff" />
                <NeonPillar position={[-12, 2, -5]} color="#00f3ff" />
                <NeonPillar position={[12, 2, -5]} color="#ff00ff" />
            </Float>
        </group>
    )
}

function NeonPillar({ position, color }) {
    return (
        <mesh position={position}>
            <boxGeometry args={[1, 10, 1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </mesh>
    )
}
