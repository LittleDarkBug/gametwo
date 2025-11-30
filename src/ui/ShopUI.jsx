import useStore, { GAME_STATES } from '../state/Store'
import { motion } from 'framer-motion'

export function ShopUI() {
    const {
        currency,
        playerAttack, playerMaxHp,
        upgradeStat, spendCurrency,
        nextLevel, setGameState, spawnEnemy, level
    } = useStore()

    const handleUpgrade = (stat) => {
        if (spendCurrency(50)) {
            upgradeStat(stat, stat === 'playerMaxHp' ? 20 : 5)
        }
    }

    const handleNextBattle = () => {
        nextLevel()
        spawnEnemy(level + 1)
        setGameState(GAME_STATES.COMBAT)
    }

    return (
        <div className="shop-container">
            <h1>ARMORY</h1>
            <div className="currency-display">{currency} ◈</div>

            <div className="upgrades-grid">
                <div className="upgrade-card">
                    <h3>ATTACK</h3>
                    <div className="stat-value">{playerAttack}</div>
                    <button
                        className="upgrade-btn"
                        onClick={() => handleUpgrade('playerAttack')}
                        disabled={currency < 50}
                    >
                        UPGRADE (50 ◈)
                    </button>
                </div>

                <div className="upgrade-card">
                    <h3>HEALTH</h3>
                    <div className="stat-value">{playerMaxHp}</div>
                    <button
                        className="upgrade-btn"
                        onClick={() => handleUpgrade('playerMaxHp')}
                        disabled={currency < 50}
                    >
                        UPGRADE (50 ◈)
                    </button>
                </div>
            </div>

            <button className="next-battle-btn" onClick={handleNextBattle}>
                NEXT BATTLE
            </button>
        </div>
    )
}
