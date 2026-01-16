import { useState, useEffect, useRef } from 'react'
import useGameStore from '../../store/gameStore'
import FairStand from './FairStand'
import PlayerAvatar from './PlayerAvatar'
import Crowd from './Crowd'
import AnimatedCrowdScene from './AnimatedCrowdScene'
import Floor from './Floor'
import Carousel from './Carousel'
import FairEnvironment from './FairEnvironment'
import FerrisWheel from './FerrisWheel'
import InteractiveCarousel from './InteractiveCarousel'
import Queue from './Queue'
import Street from './Street'
import ChristmasPath from './ChristmasPath'

function GameEnvironment() {
  const { currentScenario, scenarios, avatar, recordChoice, nextScenario } = useGameStore()
  const [selectedStand, setSelectedStand] = useState(null)
  const [standOpen, setStandOpen] = useState(null)
  const [avatarTarget, setAvatarTarget] = useState(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionLock = useRef(false)

  const scenario = scenarios[currentScenario]

  // Debug logging
  console.log('🎮 Scenario', currentScenario + 1, 'of', scenarios.length, '- Type:', scenario?.type)

  // Reset states when scenario changes
  useEffect(() => {
    setStartTime(Date.now())
    setSelectedStand(null)
    setStandOpen(null)
    setAvatarTarget(null)
    setIsTransitioning(false)
    transitionLock.current = false
    console.log('✅ Scenario', currentScenario + 1, 'ready:', scenario?.type)
  }, [currentScenario])

  // Safety check
  if (!scenario) {
    return null
  }

  // Color mapping for stand colors
  const getColorHex = (colorName) => {
    const colors = {
      'red': '#E74C3C',
      'green': '#2ECC71',
      'blue': '#3498DB'
    }
    return colors[colorName] || colorName
  }

  const handleStandClick = (choice, standPosition) => {
    // Prevent clicks during transition or if already selected
    if (selectedStand || isTransitioning || transitionLock.current) {
      console.log('⚠️ Click ignored - already processing')
      return
    }

    console.log('🖱️ Stand clicked:', choice)
    const timeToDecide = Date.now() - startTime

    // Record the choice
    recordChoice(scenario.id, choice, timeToDecide)

    // Mark stand as selected
    setSelectedStand(choice)
    setStandOpen(choice)

    // Calculate target position based on scenario type
    let targetPos

    if (scenario.type === 'carnival-attractions') {
      // Stop at the BACK of the queue (queue starts at z=2, extends back)
      const queueSize = choice === 'ferris-wheel'
        ? (scenario.leftAttraction?.queueSize || 10)
        : (scenario.rightAttraction?.queueSize || 2)
      const queueLength = Math.ceil(queueSize / 2) * 0.7 + 1
      targetPos = [standPosition[0], 0, 2 + queueLength + 1]
    } else if (scenario.type === 'street-width') {
      // Stop at the entrance of the street (arch is at z=2)
      targetPos = [standPosition[0], 0, 3.5]
    } else if (scenario.type === 'christmas-lights') {
      // Stop at the entrance of the path (now bigger like streets)
      targetPos = [standPosition[0], 0, 3.5]
    } else {
      // Default: walk close to the stand
      targetPos = [standPosition[0], 0, standPosition[2] + 1.5]
    }

    console.log('🎯 Avatar walking to:', targetPos)
    setAvatarTarget(targetPos)
  }

  const handleAvatarReachTarget = () => {
    console.log('🚶 Avatar reached destination, waiting 3 seconds...')
    // Wait 3 seconds at the destination, then return to starting position
    setTimeout(() => {
      console.log('🔙 Avatar returning to start')
      setAvatarTarget([0, 0, 8]) // Return to starting position (further back)
    }, 3000)
  }

  const handleAvatarReturnToMiddle = () => {
    // Prevent double-triggering with a lock
    if (transitionLock.current) {
      console.log('⚠️ Transition already in progress, ignoring')
      return
    }
    transitionLock.current = true
    setIsTransitioning(true)

    console.log('✨ Moving to next scenario...')

    // Small delay before advancing to ensure clean state
    setTimeout(() => {
      nextScenario()
    }, 100)
  }

  // Check if we should show the decorative elements (not for new scenarios)
  const showDecorativeElements = !['carnival-attractions', 'street-width', 'christmas-lights'].includes(scenario.type)

  return (
    <group>
      <Floor />
      {showDecorativeElements && <FairEnvironment />}
      {showDecorativeElements && <Carousel />}
      
      {/* Player Avatar - key forces re-mount on scenario change for clean state */}
      {avatar && !isTransitioning && (
        <PlayerAvatar
          key={`avatar-scenario-${currentScenario}`}
          avatarType={avatar.id}
          targetPosition={avatarTarget}
          onReachTarget={handleAvatarReachTarget}
          onReturnToMiddle={handleAvatarReturnToMiddle}
        />
      )}
      
      {scenario.type === 'color-choice' && (
        <>
          {/* Left stand */}
          <FairStand 
            position={[-3.5, 0, 0]} 
            color={getColorHex(scenario.colors[0])}
            choice={scenario.colors[0]}
            onStandClick={handleStandClick}
            isSelected={standOpen === scenario.colors[0]}
          />
          
          {/* Right stand */}
          <FairStand 
            position={[3.5, 0, 0]} 
            color={getColorHex(scenario.colors[1])}
            choice={scenario.colors[1]}
            onStandClick={handleStandClick}
            isSelected={standOpen === scenario.colors[1]}
          />
        </>
      )}

      {scenario.type === 'crowd-influence' && scenario.crowdSizes && (
        <>
          {/* Left stand with larger or smaller crowd */}
          <group>
            <FairStand 
              position={[-3.5, 0, 0]} 
              color="#8B4513" 
              choice="left"
              onStandClick={handleStandClick}
              isSelected={standOpen === 'left'}
            />
            <Crowd position={[-3.5, 0, 2.5]} size={scenario.crowdSizes[0]} />
          </group>
          
          {/* Right stand with larger or smaller crowd */}
          <group>
            <FairStand 
              position={[3.5, 0, 0]} 
              color="#8B4513" 
              choice="right"
              onStandClick={handleStandClick}
              isSelected={standOpen === 'right'}
            />
            <Crowd position={[3.5, 0, 2.5]} size={scenario.crowdSizes[1]} />
          </group>
        </>
      )}

      {scenario.type === 'animated-crowd' && scenario.leftStand && scenario.rightStand && (
        <>
          {/* Left stand */}
          <FairStand
            position={[-3.5, 0, 0]}
            color="#8B4513"
            choice="left"
            onStandClick={handleStandClick}
            isSelected={standOpen === 'left'}
          />

          {/* Right stand */}
          <FairStand
            position={[3.5, 0, 0]}
            color="#8B4513"
            choice="right"
            onStandClick={handleStandClick}
            isSelected={standOpen === 'right'}
          />

          {/* Animated NPCs arriving at stands */}
          <AnimatedCrowdScene
            leftStandConfig={scenario.leftStand}
            rightStandConfig={scenario.rightStand}
          />
        </>
      )}

      {scenario.type === 'carnival-attractions' && scenario.leftAttraction && scenario.rightAttraction && (
        <>
          {/* Ferris Wheel on the left with long queue */}
          <group>
            <FerrisWheel
              position={[-5, 0, -2]}
              onClick={handleStandClick}
              isSelected={standOpen === 'ferris-wheel'}
              choice="ferris-wheel"
            />
            <Queue
              position={[-5, 0, 2]}
              size={scenario.leftAttraction?.queueSize || 10}
              direction="back"
            />
          </group>

          {/* Carousel on the right with short queue */}
          <group>
            <InteractiveCarousel
              position={[5, 0, -2]}
              onClick={handleStandClick}
              isSelected={standOpen === 'carousel'}
              choice="carousel"
            />
            <Queue
              position={[5, 0, 2]}
              size={scenario.rightAttraction?.queueSize || 2}
              direction="back"
            />
          </group>
        </>
      )}

      {scenario.type === 'street-width' && scenario.leftStreet && scenario.rightStreet && (
        <>
          {/* Narrow street on the left */}
          <Street
            position={[-5, 0, 0]}
            width="narrow"
            onClick={handleStandClick}
            isSelected={standOpen === 'narrow'}
            choice="narrow"
          />

          {/* Wide street on the right */}
          <Street
            position={[5, 0, 0]}
            width="wide"
            onClick={handleStandClick}
            isSelected={standOpen === 'wide'}
            choice="wide"
          />
        </>
      )}

      {scenario.type === 'christmas-lights' && scenario.leftPath && scenario.rightPath && (
        <>
          {/* Path WITH Christmas lights on the left */}
          <ChristmasPath
            position={[-5.5, 0, 0]}
            hasLights={true}
            onClick={handleStandClick}
            isSelected={standOpen === 'lights'}
            choice="lights"
          />

          {/* Path WITHOUT Christmas lights on the right */}
          <ChristmasPath
            position={[5.5, 0, 0]}
            hasLights={false}
            onClick={handleStandClick}
            isSelected={standOpen === 'no-lights'}
            choice="no-lights"
          />
        </>
      )}
    </group>
  )
}

export default GameEnvironment
