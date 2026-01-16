import { useMemo } from 'react'

function Queue({ position, size = 5, direction = 'back' }) {
  // Generate queue members in a line formation
  const queueMembers = useMemo(() => {
    const members = []

    for (let i = 0; i < size; i++) {
      // Line formation going back (away from attraction)
      const offset = direction === 'back' ? i * 0.7 : -i * 0.7
      members.push({
        position: [
          position[0] + (Math.random() - 0.5) * 0.15,
          position[1],
          position[2] + offset + (Math.random() - 0.5) * 0.1
        ],
        color: `hsl(${Math.random() * 360}, 65%, 55%)`,
        hatColor: `hsl(${Math.random() * 360}, 70%, 50%)`
      })
    }
    return members
  }, [position, size, direction])

  return (
    <group>
      {queueMembers.map((member, index) => (
        <group key={index} position={member.position} scale={1.4}>
          {/* Head */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ffdbac" />
          </mesh>

          {/* Hair/Hat */}
          <mesh position={[0, 1.38, 0]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={member.hatColor} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 1.08, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
            <meshStandardMaterial color="#ffdbac" />
          </mesh>

          {/* Torso */}
          <mesh position={[0, 0.78, 0]} castShadow>
            <boxGeometry args={[0.32, 0.55, 0.18]} />
            <meshStandardMaterial color={member.color} />
          </mesh>

          {/* Arms */}
          <mesh position={[-0.22, 0.78, 0]} rotation={[0, 0, 0.2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
            <meshStandardMaterial color={member.color} />
          </mesh>
          <mesh position={[0.22, 0.78, 0]} rotation={[0, 0, -0.2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
            <meshStandardMaterial color={member.color} />
          </mesh>

          {/* Legs */}
          <mesh position={[-0.09, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
            <meshStandardMaterial color="#3a3a5a" />
          </mesh>
          <mesh position={[0.09, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
            <meshStandardMaterial color="#3a3a5a" />
          </mesh>

          {/* Feet */}
          <mesh position={[-0.09, 0.02, 0.04]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.15]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.09, 0.02, 0.04]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.15]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </group>
      ))}

      {/* Queue barrier/rope posts */}
      {size > 3 && [...Array(Math.min(Math.floor(size / 2), 4))].map((_, i) => {
        const zPos = position[2] + i * 1.4 + 0.5
        return (
          <group key={`barrier-${i}`}>
            {/* Left post */}
            <mesh position={[position[0] - 0.5, 0.4, zPos]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color="#B8860B" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[position[0] - 0.5, 0.85, zPos]} castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Right post */}
            <mesh position={[position[0] + 0.5, 0.4, zPos]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
              <meshStandardMaterial color="#B8860B" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[position[0] + 0.5, 0.85, zPos]} castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Rope between posts */}
            <mesh position={[position[0], 0.7, zPos]} castShadow>
              <boxGeometry args={[1, 0.03, 0.03]} />
              <meshStandardMaterial color="#8B0000" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default Queue
