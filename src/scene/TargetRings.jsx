import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export function TargetRings({ targets }) {
    return (
        <group>
            {targets.map((target, i) => (
                <TargetRing key={i} target={target} />
            ))}
        </group>
    )
}

function TargetRing({ target }) {
    const meshRef = useRef()

    // Convert UV (0..1) to World (-5..5)
    const x = (target.x - 0.5) * 10.0
    const z = (target.y - 0.5) * 10.0 // Y in UV is Z in 3D

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * 0.5

            // Pulse effect based on charge
            const scale = 1 + (target.charge / 100) * 0.5
            meshRef.current.scale.set(scale, scale, scale)
        }
    })

    const color = target.solved ? '#00f3ff' : (target.active ? '#00ff00' : '#ffffff')

    return (
        <group position={[x, 0.5, z]}>
            {/* 3D Ring */}
            <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.4, 0.5, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>

            {/* HTML Label/Charge Bar */}
            <Html position={[0, 1, 0]} center>
                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                    <div style={{
                        width: `${target.charge}%`,
                        height: '100%',
                        background: color,
                        transition: 'width 0.1s'
                    }} />
                </div>
            </Html>
        </group>
    )
}
