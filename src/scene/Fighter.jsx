import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import { PLAYER_STATES, ENEMY_STATES } from '../state/Store'

export function Fighter({ position, color, isPlayer, state }) {
    const group = useRef()
    const rightArm = useRef()
    const leftArm = useRef()

    // Spring animations for procedural movement
    const { rotation, colorSpring, scale, posOffset } = useSpring({
        rotation: state === PLAYER_STATES.BLOCK || state === ENEMY_STATES.BLOCK ? [0.5, 0, 0.5] :
            state === PLAYER_STATES.ATTACK || state === ENEMY_STATES.ATTACK ? [0, Math.PI / 4, 0] : [0, 0, 0],
        colorSpring: state === PLAYER_STATES.HIT || state === ENEMY_STATES.HIT ? '#ff0000' : color,
        scale: state === PLAYER_STATES.ATTACK || state === ENEMY_STATES.ATTACK ? 1.4 : 1,
        posOffset: state === PLAYER_STATES.ATTACK || state === ENEMY_STATES.ATTACK ? (isPlayer ? 2 : -2) : 0,
        config: { tension: 300, friction: 15 } // Snappier
    })

    // Idle Animation (Breathing)
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (group.current) {
            // Base position + Lunge offset + Breathing
            group.current.position.z = position[2] - (isPlayer ? posOffset.get() : -posOffset.get())
            group.current.position.y = position[1] + Math.sin(t * 2) * 0.05
        }
    })

    return (
        <animated.group ref={group} position={position} scale={scale}>
            {/* Body */}
            <mesh position={[0, 1, 0]}>
                <capsuleGeometry args={[0.4, 1, 4, 8]} />
                <animated.meshStandardMaterial color={colorSpring} roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.8, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#333" />
                {/* Eye */}
                <mesh position={[0, 0, 0.26]}>
                    <planeGeometry args={[0.4, 0.1]} />
                    <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            </mesh>

            {/* Arms (Floating for now) */}
            <animated.mesh ref={rightArm} position={[0.6, 1.2, 0.5]} rotation={rotation}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color={color} />
            </animated.mesh>

            <animated.mesh ref={leftArm} position={[-0.6, 1.2, 0.5]} rotation={rotation}>
                <boxGeometry args={[0.2, 0.6, 0.2]} />
                <meshStandardMaterial color={color} />
            </animated.mesh>
        </animated.group>
    )
}
