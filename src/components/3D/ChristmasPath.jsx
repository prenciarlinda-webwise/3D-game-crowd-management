import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

function ChristmasPath({ position = [0, 0, 0], hasLights = true, onClick, isSelected, choice }) {
  const lightsRef = useRef()
  const pathLength = 12  // Made bigger like streets
  const pathWidth = 3.5   // Made wider like streets

  useFrame((state) => {
    if (lightsRef.current && hasLights) {
      // Twinkling effect for lights
      lightsRef.current.children.forEach((light, i) => {
        if (light.material) {
          const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.3
          light.material.emissiveIntensity = intensity
        }
      })
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    console.log('🎄 Path clicked:', choice)
    if (onClick) {
      onClick(choice, position)
    }
  }

  // Generate trees along the path
  const trees = useMemo(() => {
    const treeList = []
    const numTrees = 6  // More trees for longer path

    for (let i = 0; i < numTrees; i++) {
      // Left side trees
      treeList.push({
        position: [-pathWidth / 2 - 1.2, 0, -i * (pathLength / numTrees) - 1],
        height: 2 + Math.random() * 1,
        scale: 1 + Math.random() * 0.4
      })

      // Right side trees
      treeList.push({
        position: [pathWidth / 2 + 1.2, 0, -i * (pathLength / numTrees) - 1],
        height: 2 + Math.random() * 1,
        scale: 1 + Math.random() * 0.4
      })
    }
    return treeList
  }, [pathLength, pathWidth])

  // Generate Christmas lights positions
  const christmasLights = useMemo(() => {
    if (!hasLights) return []

    const lights = []
    const numLightsPerSide = 12

    for (let i = 0; i < numLightsPerSide; i++) {
      const z = -i * (pathLength / numLightsPerSide) - 0.3

      // String lights between poles (alternating colors)
      const colors = ['#FF0000', '#00FF00', '#FFD700', '#0000FF', '#FF69B4', '#00CED1']

      // Left string
      lights.push({
        position: [-pathWidth / 2 - 0.3, 1.8 + Math.sin(i * 0.8) * 0.15, z],
        color: colors[i % colors.length]
      })

      // Right string
      lights.push({
        position: [pathWidth / 2 + 0.3, 1.8 + Math.sin(i * 0.8) * 0.15, z],
        color: colors[(i + 3) % colors.length]
      })

      // Overhead string (crossing)
      if (i % 2 === 0) {
        for (let j = 0; j < 5; j++) {
          lights.push({
            position: [
              -pathWidth / 2 + j * (pathWidth / 4),
              2.2 - Math.abs(j - 2) * 0.1,
              z
            ],
            color: colors[(i + j) % colors.length]
          })
        }
      }
    }
    return lights
  }, [hasLights, pathLength, pathWidth])

  return (
    <group position={position}>
      {/* CLICKABLE AREA - Large invisible box covering the whole path */}
      <mesh
        position={[0, 2, -pathLength / 2]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[pathWidth + 4, 5, pathLength + 2]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Path surface - cobblestone style */}
      <mesh position={[0, 0.01, -pathLength / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[pathWidth, pathLength]} />
        <meshStandardMaterial
          color={isSelected ? '#7a6a5a' : '#6a5a4a'}
          emissive={isSelected ? '#FFD700' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Cobblestone pattern */}
      {[...Array(20)].map((_, row) =>
        [...Array(4)].map((_, col) => (
          <mesh
            key={`stone-${row}-${col}`}
            position={[
              -pathWidth / 2 + 0.3 + col * 0.5 + (row % 2) * 0.25,
              0.02,
              -row * 0.4 - 0.2
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.4, 0.3]} />
            <meshStandardMaterial color={`hsl(30, 15%, ${35 + Math.random() * 15}%)`} />
          </mesh>
        ))
      )}

      {/* Path borders */}
      <mesh position={[-pathWidth / 2, 0.08, -pathLength / 2]} castShadow>
        <boxGeometry args={[0.15, 0.16, pathLength]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh position={[pathWidth / 2, 0.08, -pathLength / 2]} castShadow>
        <boxGeometry args={[0.15, 0.16, pathLength]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>

      {/* Pine Trees */}
      {trees.map((tree, index) => (
        <group key={`tree-${index}`} position={tree.position} scale={tree.scale}>
          {/* Tree trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
            <meshStandardMaterial color="#4a3020" />
          </mesh>

          {/* Tree layers (pine tree shape) */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <coneGeometry args={[0.7, 0.8, 8]} />
            <meshStandardMaterial color="#1a4a1a" />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <coneGeometry args={[0.55, 0.7, 8]} />
            <meshStandardMaterial color="#1a5a1a" />
          </mesh>
          <mesh position={[0, 1.85, 0]} castShadow>
            <coneGeometry args={[0.4, 0.6, 8]} />
            <meshStandardMaterial color="#1a6a1a" />
          </mesh>

          {/* Snow on trees */}
          <mesh position={[0, 2.1, 0]} castShadow>
            <coneGeometry args={[0.25, 0.3, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>

          {/* Tree decorations if path has lights */}
          {hasLights && (
            <>
              {[...Array(6)].map((_, li) => {
                const angle = (li / 6) * Math.PI * 2
                const radius = 0.35 + (li % 2) * 0.2
                const height = 1.0 + li * 0.15
                return (
                  <mesh
                    key={`ornament-${li}`}
                    position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
                    castShadow
                  >
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial
                      color={['#FF0000', '#FFD700', '#0000FF', '#FF69B4', '#00FF00', '#FFA500'][li]}
                      emissive={['#FF0000', '#FFD700', '#0000FF', '#FF69B4', '#00FF00', '#FFA500'][li]}
                      emissiveIntensity={0.4}
                    />
                  </mesh>
                )
              })}
              {/* Star on top */}
              <mesh position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <boxGeometry args={[0.15, 0.15, 0.03]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* Light poles and strings (only if hasLights) */}
      {hasLights && (
        <>
          {/* Light poles */}
          {[...Array(4)].map((_, i) => {
            const z = -i * 2 - 1
            return (
              <group key={`pole-${i}`}>
                {/* Left pole */}
                <mesh position={[-pathWidth / 2 - 0.3, 1.1, z]} castShadow>
                  <cylinderGeometry args={[0.05, 0.06, 2.2, 8]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>
                {/* Cross beam left */}
                <mesh position={[-pathWidth / 2 + 0.2, 2.15, z]} castShadow>
                  <boxGeometry args={[1, 0.06, 0.06]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>

                {/* Right pole */}
                <mesh position={[pathWidth / 2 + 0.3, 1.1, z]} castShadow>
                  <cylinderGeometry args={[0.05, 0.06, 2.2, 8]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>
                {/* Cross beam right */}
                <mesh position={[pathWidth / 2 - 0.2, 2.15, z]} castShadow>
                  <boxGeometry args={[1, 0.06, 0.06]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>

                {/* Overhead wire */}
                <mesh position={[0, 2.2, z]} castShadow>
                  <boxGeometry args={[pathWidth + 0.6, 0.02, 0.02]} />
                  <meshStandardMaterial color="#1a1a1a" />
                </mesh>
              </group>
            )
          })}

          {/* Christmas lights */}
          <group ref={lightsRef}>
            {christmasLights.map((light, i) => (
              <mesh key={`light-${i}`} position={light.position} castShadow>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial
                  color={light.color}
                  emissive={light.color}
                  emissiveIntensity={0.6}
                />
              </mesh>
            ))}
          </group>

          {/* Garland strings between poles */}
          {[...Array(3)].map((_, i) => {
            const z = -i * 2 - 2
            return (
              <group key={`garland-${i}`}>
                {/* Left garland */}
                <mesh position={[-pathWidth / 2 - 0.3, 1.6, z]} castShadow>
                  <boxGeometry args={[0.08, 0.08, 1.5]} />
                  <meshStandardMaterial color="#1a4a1a" />
                </mesh>
                {/* Right garland */}
                <mesh position={[pathWidth / 2 + 0.3, 1.6, z]} castShadow>
                  <boxGeometry args={[0.08, 0.08, 1.5]} />
                  <meshStandardMaterial color="#1a4a1a" />
                </mesh>
              </group>
            )
          })}
        </>
      )}

      {/* Simple lamp posts for non-light path */}
      {!hasLights && [...Array(3)].map((_, i) => {
        const z = -i * 2.5 - 1
        return (
          <group key={`simple-lamp-${i}`}>
            <mesh position={[-pathWidth / 2 - 0.4, 1, z]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 2, 8]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
            <mesh position={[-pathWidth / 2 - 0.4, 2.1, z]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.3} />
            </mesh>

            <mesh position={[pathWidth / 2 + 0.4, 1, z]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 2, 8]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
            <mesh position={[pathWidth / 2 + 0.4, 2.1, z]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.3} />
            </mesh>
          </group>
        )
      })}

      {/* Entry arch */}
      <mesh position={[0, 1.8, 0.3]} castShadow>
        <boxGeometry args={[pathWidth + 0.8, 0.2, 0.2]} />
        <meshStandardMaterial color={hasLights ? '#8B0000' : '#5a4a3a'} />
      </mesh>
      <mesh position={[-pathWidth / 2 - 0.3, 0.9, 0.3]} castShadow>
        <boxGeometry args={[0.2, 1.8, 0.2]} />
        <meshStandardMaterial color={hasLights ? '#8B0000' : '#5a4a3a'} />
      </mesh>
      <mesh position={[pathWidth / 2 + 0.3, 0.9, 0.3]} castShadow>
        <boxGeometry args={[0.2, 1.8, 0.2]} />
        <meshStandardMaterial color={hasLights ? '#8B0000' : '#5a4a3a'} />
      </mesh>

      {/* Wreath on arch if hasLights */}
      {hasLights && (
        <group position={[0, 2.2, 0.4]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.3, 0.08, 8, 16]} />
            <meshStandardMaterial color="#1a5a1a" />
          </mesh>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.15, 0.25, 0.05]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        </group>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.03, -pathLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[pathWidth + 2, pathLength + 1]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  )
}

export default ChristmasPath
