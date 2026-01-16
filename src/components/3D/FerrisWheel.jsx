import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function FerrisWheel({ position = [0, 0, 0], onClick, isSelected, choice }) {
  const wheelRef = useRef()

  useFrame(() => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z += 0.008
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick(choice, position)
    }
  }

  return (
    <group position={position}>
      {/* Base/Support Structure */}
      <mesh position={[-1.2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[1.2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Cross supports */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.1, 3.5, 0.1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.1, 3.5, 0.1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Platform Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[3.5, 0.2, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Rotating Wheel */}
      <group ref={wheelRef} position={[0, 3.5, 0]}>
        {/* Main wheel ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[2.2, 0.08, 8, 24]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>

        {/* Inner ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.5, 0.05, 8, 24]} />
          <meshStandardMaterial color="#FF6347" />
        </mesh>

        {/* Center hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Spokes and Cabins - 8 positions */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 2.2
          const y = Math.sin(angle) * 2.2

          return (
            <group key={i}>
              {/* Spoke */}
              <mesh position={[x / 2, y / 2, 0]} rotation={[0, 0, angle]} castShadow>
                <boxGeometry args={[2.2, 0.06, 0.06]} />
                <meshStandardMaterial color="#CD853F" />
              </mesh>

              {/* Cabin */}
              <group position={[x, y, 0]} rotation={[0, 0, -angle]}>
                <mesh castShadow>
                  <boxGeometry args={[0.5, 0.6, 0.4]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? '#4169E1' : '#32CD32'}
                    emissive={isSelected ? '#FFD700' : '#000000'}
                    emissiveIntensity={isSelected ? 0.3 : 0}
                  />
                </mesh>
                {/* Cabin roof */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <boxGeometry args={[0.55, 0.1, 0.45]} />
                  <meshStandardMaterial color="#333333" />
                </mesh>
              </group>
            </group>
          )
        })}

        {/* Decorative lights on wheel */}
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2
          const x = Math.cos(angle) * 2.2
          const y = Math.sin(angle) * 2.2

          return (
            <mesh key={`light-${i}`} position={[x, y, 0.1]} castShadow>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color={i % 4 === 0 ? '#FF0000' : i % 4 === 1 ? '#FFFF00' : i % 4 === 2 ? '#00FF00' : '#00BFFF'}
                emissive={i % 4 === 0 ? '#FF0000' : i % 4 === 1 ? '#FFFF00' : i % 4 === 2 ? '#00FF00' : '#00BFFF'}
                emissiveIntensity={0.6}
              />
            </mesh>
          )
        })}
      </group>

      {/* Sign */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* CLICKABLE AREA - Large invisible box covering the whole attraction */}
      <mesh
        position={[0, 3, 0]}
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
        <boxGeometry args={[4, 7, 3]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.2, 32]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  )
}

export default FerrisWheel
