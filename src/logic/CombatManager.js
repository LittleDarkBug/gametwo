import useStore, { PLAYER_STATES, ENEMY_STATES } from '../state/Store'

export const useCombatLogic = () => {
    const {
        playerState, setPlayerState,
        enemyState, setEnemyState,
        damageEnemy, damagePlayer,
        playerStamina,
        playerAttack,
        enemyHp
    } = useStore()

    const handleAttack = (direction) => {
        if (playerState !== PLAYER_STATES.IDLE) return

        // Attack Logic
        setPlayerState(PLAYER_STATES.ATTACK)

        // Check Hit (Simple timing check for now, later we check Enemy State)
        setTimeout(() => {
            if (enemyState === ENEMY_STATES.BLOCK) {
                // Blocked!
                // Maybe recoil?
            } else {
                // Hit!
                damageEnemy(playerAttack)
                setEnemyState(ENEMY_STATES.HIT)
                setTimeout(() => setEnemyState(ENEMY_STATES.IDLE), 500)
            }

            // Reset Player
            setTimeout(() => setPlayerState(PLAYER_STATES.IDLE), 500)
        }, 200) // Delay for animation impact
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
