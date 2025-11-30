import useStore, { PLAYER_STATES, ENEMY_STATES } from '../state/Store'

export const useCombatLogic = () => {
    const {
        playerState, setPlayerState,
        enemyState, setEnemyState,
        damageEnemy, damagePlayer,
        playerAttack
    } = useStore()

    const handleAttack = (direction) => {
        if (playerState !== PLAYER_STATES.IDLE) return

        // Attack Logic
        setPlayerState(PLAYER_STATES.ATTACK)

        // Check Hit
        setTimeout(() => {
            // Get fresh state
            const currentEnemyState = useStore.getState().enemyState

            if (currentEnemyState === ENEMY_STATES.BLOCK) {
                // Blocked!
                // TODO: Add recoil or spark effect
            } else {
                // Hit!
                damageEnemy(playerAttack)
                setEnemyState(ENEMY_STATES.HIT)
                setTimeout(() => setEnemyState(ENEMY_STATES.IDLE), 500)
            }

            // Reset Player
            setTimeout(() => setPlayerState(PLAYER_STATES.IDLE), 500) // Longer cooldown for animation
        }, 150) // Impact timing
    }

    const handleBlock = (down) => {
        if (down) {
            setPlayerState(PLAYER_STATES.BLOCK)
        } else {
            setPlayerState(PLAYER_STATES.IDLE)
        }
    }

    return { handleAttack, handleBlock }
}
