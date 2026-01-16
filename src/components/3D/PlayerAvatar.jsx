import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import Avatar3D from './Avatar3D'

function PlayerAvatar({ avatarType, targetPosition, onReachTarget, onReturnToMiddle }) {
  const groupRef = useRef()
  const [isWalking, setIsWalking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState([0, 0, 8]) // Start further back
  const [phase, setPhase] = useState('idle') // 'idle', 'walking-to-stand', 'at-stand', 'walking-back'
  const walkSpeed = 0.05 // Slightly faster
  const hasReachedStand = useRef(false)
  const hasReachedMiddle = useRef(false)

  // Start walking when targetPosition is set
  useEffect(() => {
    if (targetPosition) {
      setIsWalking(true)
      // Determine which phase based on target
      if (targetPosition[0] === 0 && targetPosition[2] === 8) {
        setPhase('walking-back')
      } else {
        setPhase('walking-to-stand')
        hasReachedStand.current = false
      }
    }
  }, [targetPosition])

  useFrame(() => {
    if (!groupRef.current || !isWalking || !targetPosition) return

    const [currentX, currentY, currentZ] = currentPosition
    const [targetX, targetY, targetZ] = targetPosition

    // Calculate distance
    const dx = targetX - currentX
    const dz = targetZ - currentZ
    const distance = Math.sqrt(dx * dx + dz * dz)

    // Check if reached target
    if (distance < 0.15) {
      setIsWalking(false)
      groupRef.current.position.set(targetX, targetY, targetZ)
      setCurrentPosition([targetX, targetY, targetZ])

      if (phase === 'walking-to-stand' && !hasReachedStand.current) {
        hasReachedStand.current = true
        setPhase('at-stand')
        console.log('📍 Avatar at stand')
        if (onReachTarget) {
          onReachTarget()
        }
      } else if (phase === 'walking-back' && !hasReachedMiddle.current) {
        hasReachedMiddle.current = true
        setPhase('idle')
        console.log('📍 Avatar back at middle')
        if (onReturnToMiddle) {
          onReturnToMiddle()
        }
      }
      return
    }

    // Move towards target
    const moveX = (dx / distance) * walkSpeed
    const moveZ = (dz / distance) * walkSpeed

    const newX = currentX + moveX
    const newZ = currentZ + moveZ

    setCurrentPosition([newX, currentY, newZ])
    groupRef.current.position.set(newX, currentY, newZ)

    // Rotate to face movement direction
    const angle = Math.atan2(dx, dz)
    groupRef.current.rotation.y = angle

    // Simple walking animation (bob up and down)
    const bobAmount = Math.sin(Date.now() * 0.015) * 0.08
    groupRef.current.position.y = currentY + bobAmount
  })

  return (
    <group ref={groupRef} position={currentPosition}>
      <Avatar3D avatarType={avatarType} scale={1.3} />
    </group>
  )
}

export default PlayerAvatar
