import { useEffect } from 'react'
import GameScene from './scene/GameScene'
import useStore, { GAME_STATES } from './state/Store'
import './App.css'

import { InputManager } from './ui/InputManager'

import { HUD } from './ui/HUD'
import { MainMenu } from './ui/MainMenu'
import { ShopUI } from './ui/ShopUI'

function App() {
  const gameState = useStore(state => state.gameState)
  const setGameState = useStore(state => state.setGameState)

  // Start in MENU
  // useEffect(() => { setGameState(GAME_STATES.MENU) }, [])

  return (
    <div className="app-container">
      <div className="canvas-layer">
        <GameScene />
      </div>

      <div className="ui-layer">
        {gameState === GAME_STATES.COMBAT && <InputManager />}

        {gameState === GAME_STATES.MENU && <MainMenu />}
        {gameState === GAME_STATES.COMBAT && <HUD />}
        {gameState === GAME_STATES.SHOP && <ShopUI />}
      </div>
    </div>
  )
}

export default App
