import { useMemo } from 'react'

function Street({ position = [0, 0, 0], width = 'wide', onClick, isSelected, choice }) {
  const isWide = width === 'wide'
  const streetWidth = isWide ? 4.5 : 1.5
  const streetLength = 12

  const handleClick = (e) => {
    e.stopPropagation()
    console.log('🛣️ Street clicked:', choice)
    if (onClick) {
      onClick(choice, position)
    }
  }

  // Generate buildings along the street
  const buildings = useMemo(() => {
    const buildingList = []
    const numBuildings = 4

    for (let i = 0; i < numBuildings; i++) {
      const zPos = -streetLength / 2 + i * (streetLength / numBuildings) + 1.5

      // Left side buildings
      buildingList.push({
        position: [-streetWidth / 2 - (isWide ? 1.8 : 1), 0, zPos],
        height: 2.5 + Math.random() * 2,
        width: isWide ? 2.5 : 1.5,
        depth: 1.8,
        color: `hsl(${15 + Math.random() * 25}, ${35 + Math.random() * 15}%, ${45 + Math.random() * 20}%)`
      })

      // Right side buildings
      buildingList.push({
        position: [streetWidth / 2 + (isWide ? 1.8 : 1), 0, zPos],
        height: 2.5 + Math.random() * 2,
        width: isWide ? 2.5 : 1.5,
        depth: 1.8,
        color: `hsl(${15 + Math.random() * 25}, ${35 + Math.random() * 15}%, ${45 + Math.random() * 20}%)`
      })
    }
    return buildingList
  }, [isWide, streetWidth, streetLength])

  return (
    <group position={position}>
      {/* CLICKABLE AREA - Large invisible box covering the whole street */}
      <mesh
        position={[0, 2, -streetLength / 2 + 2]}
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
        <boxGeometry args={[streetWidth + 4, 5, streetLength + 2]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Street surface */}
      <mesh position={[0, 0.02, -streetLength / 2 + 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[streetWidth, streetLength]} />
        <meshStandardMaterial
          color={isSelected ? '#5a5a6a' : '#3a3a4a'}
          emissive={isSelected ? '#FFD700' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Street center line (dashed) - only for wide street */}
      {isWide && [...Array(Math.floor(streetLength / 1.5))].map((_, i) => (
        <mesh key={`line-${i}`} position={[0, 0.03, -i * 1.5 + 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 0.8]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      ))}

      {/* Edge lines for wide street */}
      {isWide && (
        <>
          <mesh position={[-streetWidth / 2 + 0.15, 0.03, -streetLength / 2 + 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, streetLength]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[streetWidth / 2 - 0.15, 0.03, -streetLength / 2 + 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, streetLength]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </>
      )}

      {/* Sidewalks */}
      <mesh position={[-streetWidth / 2 - 0.4, 0.08, -streetLength / 2 + 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.8, streetLength]} />
        <meshStandardMaterial color="#909090" />
      </mesh>
      <mesh position={[streetWidth / 2 + 0.4, 0.08, -streetLength / 2 + 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.8, streetLength]} />
        <meshStandardMaterial color="#909090" />
      </mesh>

      {/* Raised curbs */}
      <mesh position={[-streetWidth / 2, 0.1, -streetLength / 2 + 2]} castShadow>
        <boxGeometry args={[0.15, 0.2, streetLength]} />
        <meshStandardMaterial color="#606060" />
      </mesh>
      <mesh position={[streetWidth / 2, 0.1, -streetLength / 2 + 2]} castShadow>
        <boxGeometry args={[0.15, 0.2, streetLength]} />
        <meshStandardMaterial color="#606060" />
      </mesh>

      {/* Buildings */}
      {buildings.map((building, index) => (
        <group key={index} position={building.position}>
          {/* Building body */}
          <mesh position={[0, building.height / 2, 0]} castShadow>
            <boxGeometry args={[building.width, building.height, building.depth]} />
            <meshStandardMaterial color={building.color} />
          </mesh>

          {/* Roof */}
          <mesh position={[0, building.height + 0.2, 0]} castShadow>
            <boxGeometry args={[building.width + 0.15, 0.25, building.depth + 0.15]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>

          {/* Windows - multiple rows */}
          {[...Array(Math.floor(building.height / 0.8))].map((_, wi) => (
            <group key={`window-row-${wi}`}>
              {/* Front windows */}
              <mesh position={[-building.width * 0.25, 0.6 + wi * 0.8, building.depth / 2 + 0.01]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.02]} />
                <meshStandardMaterial color="#87CEEB" emissive="#FFFFAA" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[building.width * 0.25, 0.6 + wi * 0.8, building.depth / 2 + 0.01]} castShadow>
                <boxGeometry args={[0.4, 0.5, 0.02]} />
                <meshStandardMaterial color="#87CEEB" emissive="#FFFFAA" emissiveIntensity={0.3} />
              </mesh>
            </group>
          ))}

          {/* Door */}
          <mesh position={[0, 0.6, building.depth / 2 + 0.01]} castShadow>
            <boxGeometry args={[0.5, 1.2, 0.02]} />
            <meshStandardMaterial color="#4a2a1a" />
          </mesh>

          {/* Awning over door */}
          <mesh position={[0, 1.3, building.depth / 2 + 0.2]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.05, 0.4]} />
            <meshStandardMaterial color={isWide ? "#2E8B57" : "#8B4513"} />
          </mesh>
        </group>
      ))}

      {/* Street lamps - bigger */}
      {[...Array(4)].map((_, i) => {
        const zPos = -i * 3 + 0.5
        return (
          <group key={`lamp-${i}`}>
            {/* Left lamp */}
            <mesh position={[-streetWidth / 2 - 0.6, 1.5, zPos]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 3, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[-streetWidth / 2 - 0.6, 3.1, zPos]} castShadow>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.6} />
            </mesh>

            {/* Right lamp */}
            <mesh position={[streetWidth / 2 + 0.6, 1.5, zPos]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 3, 8]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[streetWidth / 2 + 0.6, 3.1, zPos]} castShadow>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.6} />
            </mesh>
          </group>
        )
      })}

      {/* Large Entry Arch with Label */}
      <group position={[0, 0, 2]}>
        {/* Arch pillars */}
        <mesh position={[-streetWidth / 2 - 0.3, 1.5, 0]} castShadow>
          <boxGeometry args={[0.4, 3, 0.4]} />
          <meshStandardMaterial color={isWide ? "#2E8B57" : "#8B4513"} />
        </mesh>
        <mesh position={[streetWidth / 2 + 0.3, 1.5, 0]} castShadow>
          <boxGeometry args={[0.4, 3, 0.4]} />
          <meshStandardMaterial color={isWide ? "#2E8B57" : "#8B4513"} />
        </mesh>

        {/* Arch top */}
        <mesh position={[0, 3.1, 0]} castShadow>
          <boxGeometry args={[streetWidth + 1, 0.4, 0.4]} />
          <meshStandardMaterial color={isWide ? "#2E8B57" : "#8B4513"} />
        </mesh>

        {/* Sign board */}
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[streetWidth * 0.8, 0.8, 0.15]} />
          <meshStandardMaterial color="#F5F5DC" />
        </mesh>

        {/* Sign text indicator (colored bar) */}
        <mesh position={[0, 3.8, 0.08]} castShadow>
          <boxGeometry args={[streetWidth * 0.7, 0.5, 0.02]} />
          <meshStandardMaterial
            color={isWide ? "#228B22" : "#CD853F"}
            emissive={isWide ? "#228B22" : "#CD853F"}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Visual width indicator arrows on ground */}
      <group position={[0, 0.04, 1]}>
        {/* Left arrow */}
        <mesh position={[-streetWidth / 4, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.4, 3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Right arrow */}
        <mesh position={[streetWidth / 4, 0, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.4, 3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Line between */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[streetWidth / 2, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.05, -streetLength / 2 + 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[streetWidth + 2, streetLength + 2]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.35} />
        </mesh>
      )}

      {/* People walking on wide street (to show it's more popular/easier) */}
      {isWide && [...Array(4)].map((_, i) => (
        <group key={`person-${i}`} position={[(i % 2 === 0 ? 1 : -1) * (1 + Math.random()), 0, -i * 2 - 2]} scale={1.2}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#ffdbac" />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.25, 0.45, 0.15]} />
            <meshStandardMaterial color={`hsl(${Math.random() * 360}, 60%, 50%)`} />
          </mesh>
          <mesh position={[-0.07, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
            <meshStandardMaterial color="#2a2a4a" />
          </mesh>
          <mesh position={[0.07, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
            <meshStandardMaterial color="#2a2a4a" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default Street
