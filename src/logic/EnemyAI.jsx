import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useStore, { ENEMY_STATES, PLAYER_STATES } from '../state/Store'

export function EnemyAI() {
    const {
        enemyState, setEnemyState,
        playerState, damagePlayer,
        level
    } = useStore()

    const timer = useRef(0)
    const stateRef = useRef(enemyState)

    // Sync ref
    stateRef.current = enemyState

    useFrame((state, delta) => {
        if (stateRef.current === ENEMY_STATES.HIT || stateRef.current === ENEMY_STATES.STUNNED) {
            // AI is interrupted, logic handled by CombatManager/Store
            return
        }

        timer.current += delta

        // AI State Machine
        switch (stateRef.current) {
            case ENEMY_STATES.IDLE:
                // Wait for random time before attacking
                // SLOWER: 2s to 4s wait
                const waitTime = Math.max(2.0, 4.0 - level * 0.2)
                if (timer.current > waitTime) {
                    setEnemyState(ENEMY_STATES.TELEGRAPH)
                    timer.current = 0
                }
                break

            case ENEMY_STATES.TELEGRAPH:
                // Show warning for reaction time
                // EASIER: 1.5s reaction time
                const reactionTime = Math.max(1.2, 2.0 - level * 0.1)
                if (timer.current > reactionTime) {
                    setEnemyState(ENEMY_STATES.ATTACK)
                    timer.current = 0

                    // Execute Attack Logic
                    if (useStore.getState().playerState !== PLAYER_STATES.BLOCK) {
                        damagePlayer(5 + level * 1)
                    }
                }
                break

            case ENEMY_STATES.ATTACK:
                // Attack recovery
                if (timer.current > 0.5) {
                    setEnemyState(ENEMY_STATES.RECOVER)
                    timer.current = 0
                }
                break

            case ENEMY_STATES.RECOVER:
                // Vulnerable window
                if (timer.current > 1.5) { // Longer vulnerability
                    setEnemyState(ENEMY_STATES.IDLE)
                    timer.current = 0
                }
                break
        }
    })

    return null
}
