import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function GameLogic({ sources, targets, onTargetsUpdate }) {
    const lastUpdateRef = useRef(0)

    useFrame((state) => {
        const time = state.clock.elapsedTime

        if (time - lastUpdateRef.current < 0.05) return
        lastUpdateRef.current = time

        let changed = false
        const newTargets = targets.map(t => {
            if (t.solved) return t

            const tx = (t.x - 0.5) * 10.0
            const ty = (t.y - 0.5) * 10.0

            let amplitude = 0.0

            sources.forEach(source => {
                const sx = (source.x - 0.5) * 10.0
                const sy = (source.y - 0.5) * 10.0

                const dist = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2))
                const freq = source.freq

                const wave = Math.sin(dist * 4.0 * freq - time * 3.0)
                const attenuation = 1.0 / (1.0 + dist * 1.5)

                amplitude += wave * attenuation
            })

            const absAmp = Math.abs(amplitude)

            let newCharge = t.charge
            let isActive = false

            if (absAmp > t.threshold) {
                newCharge += 2.0
                isActive = true
            } else {
                newCharge -= 1.0
            }

            newCharge = Math.max(0, Math.min(100, newCharge))
            const isSolved = newCharge >= 100

            if (isSolved !== t.solved || isActive !== t.active || Math.abs(newCharge - t.charge) > 1) {
                changed = true
            }

            return { ...t, charge: newCharge, solved: isSolved, active: isActive }
        })

        if (changed) {
            onTargetsUpdate(newTargets)
        }
    })

    return null
}
