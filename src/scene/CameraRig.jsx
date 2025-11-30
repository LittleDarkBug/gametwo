import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import useStore, { PLAYER_STATES } from '../state/Store'

export function CameraRig() {
    const cameraRef = useRef()
    const playerState = useStore(state => state.playerState)
    const { viewport } = useThree()

    // Detect mobile portrait mode
    const isPortrait = viewport.aspect < 1
    // Moved back and up significantly to see both fighters clearly
    const baseDist = isPortrait ? 14 : 10
    const baseHeight = isPortrait ? 6 : 4

    // Target position for smooth interpolation
    const targetPos = useRef(new THREE.Vector3(0, baseHeight, baseDist))
    const targetLookAt = useRef(new THREE.Vector3(0, 1, 0))

    useFrame((state, delta) => {
        // Dynamic Camera Movement based on state
        if (playerState === PLAYER_STATES.ATTACK) {
            // Zoom in slightly on attack
            targetPos.current.set(0, baseHeight, baseDist - 1)
        } else if (playerState === PLAYER_STATES.BLOCK) {
            // Pull back on block
            targetPos.current.set(0, baseHeight + 0.2, baseDist + 0.5)
        } else {
            // Idle sway
            const t = state.clock.getElapsedTime()
            targetPos.current.set(Math.sin(t * 0.5) * 0.5, baseHeight + Math.cos(t * 0.5) * 0.1, baseDist)
        }

        // Smooth Lerp
        if (cameraRef.current) {
            cameraRef.current.position.lerp(targetPos.current, delta * 2)

            // Look at enemy (0, 1, 0) roughly
            const currentLookAt = new THREE.Vector3(0, 1, 0)
            // We could lerp the lookAt too if we had a controls target, but OrbitControls might fight this.
            // Since we want a "Rig", we should probably disable OrbitControls or make this the parent.
            // For now, let's just update position and let OrbitControls handle the target if it's enabled,
            // OR disable OrbitControls and handle lookAt manually.

            // Let's handle lookAt manually for cinematic feel
            cameraRef.current.lookAt(0, 1, 0)
        }
    })

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 5]} fov={50} />
}
