import useStore, { GAME_STATES } from '../state/Store'
import { motion } from 'framer-motion'

export function MainMenu() {
    const setGameState = useStore(state => state.setGameState)

    return (
        <div className="menu-container">
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="game-title"
            >
                NEON<br />GLADIATOR
            </motion.h1>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="menu-buttons"
            >
                <button className="menu-btn primary" onClick={() => setGameState(GAME_STATES.COMBAT)}>
                    START COMBAT
                </button>
                <button className="menu-btn" disabled>
                    SETTINGS
                </button>
            </motion.div>

            <div className="version">v1.0.0</div>
        </div>
    )
}
