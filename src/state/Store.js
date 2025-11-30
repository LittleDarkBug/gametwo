import { create } from 'zustand'

export const GAME_STATES = {
    MENU: 'MENU',
    COMBAT: 'COMBAT',
    SHOP: 'SHOP',
    GAMEOVER: 'GAMEOVER',
    VICTORY: 'VICTORY'
}

export const ENEMY_STATES = {
    IDLE: 'IDLE',
    TELEGRAPH: 'TELEGRAPH',
    ATTACK: 'ATTACK',
    RECOVER: 'RECOVER',
    STUNNED: 'STUNNED',
    HIT: 'HIT',
    BLOCK: 'BLOCK'
}

export const PLAYER_STATES = {
    IDLE: 'IDLE',
    ATTACK: 'ATTACK',
    BLOCK: 'BLOCK',
    DODGE: 'DODGE',
    HIT: 'HIT',
    STUNNED: 'STUNNED'
}

const useStore = create((set, get) => ({
    // --- Game Flow ---
    gameState: GAME_STATES.MENU,
    level: 1,
    setGameState: (state) => set({ gameState: state }),
    nextLevel: () => set((state) => ({ level: state.level + 1 })),
    resetGame: () => set({
        gameState: GAME_STATES.MENU,
        level: 1,
        playerHp: 100,
        currency: 0
    }),

    // --- Economy ---
    currency: 0,
    addCurrency: (amount) => set((state) => ({ currency: state.currency + amount })),
    spendCurrency: (amount) => {
        const current = get().currency
        if (current >= amount) {
            set({ currency: current - amount })
            return true
        }
        return false
    },

    // --- Player Stats ---
    playerMaxHp: 100,
    playerHp: 100,
    playerAttack: 10,
    playerDefense: 5,
    playerStamina: 100,
    playerMaxStamina: 100,
    playerState: PLAYER_STATES.IDLE,

    setPlayerState: (state) => set({ playerState: state }),
    damagePlayer: (amount) => set((state) => {
        const damage = Math.max(1, amount - state.playerDefense)
        const newHp = Math.max(0, state.playerHp - damage)
        return {
            playerHp: newHp,
            gameState: newHp <= 0 ? GAME_STATES.GAMEOVER : state.gameState
        }
    }),
    healPlayer: (amount) => set((state) => ({
        playerHp: Math.min(state.playerMaxHp, state.playerHp + amount)
    })),
    upgradeStat: (stat, amount) => set((state) => ({ [stat]: state[stat] + amount })),

    // --- Enemy Stats ---
    enemyMaxHp: 100,
    enemyHp: 100,
    enemyState: ENEMY_STATES.IDLE,

    spawnEnemy: (level) => set({
        enemyMaxHp: 100 + (level * 20),
        enemyHp: 100 + (level * 20),
        enemyState: ENEMY_STATES.IDLE
    }),
    setEnemyState: (state) => set({ enemyState: state }),
    damageEnemy: (amount) => set((state) => {
        const newHp = Math.max(0, state.enemyHp - amount)
        return {
            enemyHp: newHp,
            // Victory check is usually done in the game loop or here
            gameState: newHp <= 0 ? GAME_STATES.VICTORY : state.gameState
        }
    }),
}))

export default useStore
