import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { Arena } from './Arena'
import { Suspense } from 'react'
import { CameraRig } from './CameraRig'
import { Fighter } from './Fighter'
import { EnemyAI } from '../logic/EnemyAI'
import useStore from '../state/Store'

export default function GameScene() {
    const playerState = useStore(state => state.playerState)
    const enemyState = useStore(state => state.enemyState)

    return (
        <Canvas dpr={[1, 2]} shadows>
            <CameraRig />
            <EnemyAI />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff00ff" />

            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 5, 30]} />

            <Suspense fallback={null}>
                <Arena />

                {/* Player (Blue) */}
                <Fighter
                    position={[0, 0, 3]}
                    color="#00f3ff"
                    isPlayer={true}
                    state={playerState}
                />

                {/* Enemy (Red) */}
                <Fighter
                    position={[0, 0, -1]}
                    color="#ff0055"
                    isPlayer={false}
                    state={enemyState}
                />

                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
                    <ChromaticAberration offset={[0.002, 0.002]} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    )
}
