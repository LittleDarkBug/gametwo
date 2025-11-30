import useStore, { ENEMY_STATES } from '../state/Store'
import { motion, AnimatePresence } from 'framer-motion'

export function HUD() {
    const { playerHp, playerMaxHp, enemyHp, enemyMaxHp, level, currency, enemyState } = useStore()

    let hintText = ""
    let hintColor = "white"

    if (enemyState === ENEMY_STATES.TELEGRAPH) {
        hintText = "BLOCK NOW! (TAP)"
        hintColor = "#ff0055"
    } else if (enemyState === ENEMY_STATES.RECOVER || enemyState === ENEMY_STATES.STUNNED) {
        hintText = "ATTACK! (SWIPE)"
        hintColor = "#00f3ff"
    }

    return (
        <div className="hud-container">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="level-indicator">LEVEL {level}</div>
                <div className="currency-indicator">{currency} CREDITS</div>
            </div>

            {/* Dynamic Action Hint */}
            <AnimatePresence>
                {hintText && (
                    <motion.div
                        className="action-hint"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        style={{ color: hintColor }}
                    >
                        {hintText}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enemy Health */}
            <div className="health-bar-container enemy">
                <div className="label">ENEMY</div>
                <div className="bar-bg">
                    <motion.div
                        className="bar-fill red"
                        initial={{ width: '100%' }}
                        animate={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>

            {/* Player Health */}
            <div className="health-bar-container player">
                <div className="label">PLAYER</div>
                <div className="bar-bg">
                    <motion.div
                        className="bar-fill blue"
                        initial={{ width: '100%' }}
                        animate={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>

            {/* Controls Hint */}
            <div className="controls-hint">
                SWIPE TO ATTACK • TAP TO BLOCK
            </div>
        </div>
    )
}
