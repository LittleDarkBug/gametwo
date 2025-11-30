import { useGesture } from '@use-gesture/react'
import { useCombatLogic } from '../logic/CombatManager'
import { useState, useRef } from 'react'

export function InputManager() {
    const { handleAttack, handleBlock } = useCombatLogic()
    const [trail, setTrail] = useState([])
    const trailTimeout = useRef()

    const bind = useGesture({
        onDrag: ({ swipe: [swipeX, swipeY], movement: [mx, my], dragging }) => {
            // Visual Trail
            if (dragging) {
                setTrail(prev => [...prev.slice(-5), { x: mx, y: my, id: Date.now() }])
                clearTimeout(trailTimeout.current)
                trailTimeout.current = setTimeout(() => setTrail([]), 100)
            }

            // Swipe Logic
            if (swipeX !== 0 || swipeY !== 0) {
                const direction = Math.abs(swipeX) > Math.abs(swipeY)
                    ? (swipeX > 0 ? 'RIGHT' : 'LEFT')
                    : (swipeY > 0 ? 'DOWN' : 'UP')
                handleAttack(direction)
            }
        },
        onPointerDown: () => handleBlock(true),
        onPointerUp: () => handleBlock(false)
    }, {
        drag: {
            swipe: {
                velocity: 0.2,
                distance: 20
            }
        }
    })

    return (
        <div
            {...bind()}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 100,
                touchAction: 'none'
            }}
        >
            {/* Simple SVG Trail */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                {trail.map((point, i) => (
                    <circle key={point.id} cx={window.innerWidth / 2 + point.x} cy={window.innerHeight / 2 + point.y} r={10 - i} fill="#00f3ff" opacity={0.5} />
                ))}
            </svg>
        </div>
    )
}
