import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function InteractiveCarousel({ position = [0, 0, 0], onClick, isSelected, choice }) {
  const carouselRef = useRef()

  useFrame(() => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += 0.01
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
      {/* Base Platform */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.25, 16]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive={isSelected ? '#FFD700' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Rotating Part */}
      <group ref={carouselRef}>
        {/* Central Pole */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 4.2, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Top Roof */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <coneGeometry args={[2.2, 1.3, 16]} />
          <meshStandardMaterial color="#FF1493" />
        </mesh>

        {/* Roof stripes */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={`stripe-${i}`} position={[0, 4.5, 0]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.02, 1.4, 2.2]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          )
        })}

        {/* Decorative top */}
        <mesh position={[0, 5.3, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Flag on top */}
        <mesh position={[0, 5.6, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0.15, 5.7, 0]} castShadow>
          <boxGeometry args={[0.25, 0.15, 0.02]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>

        {/* Carousel Horses - 8 positions */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 1.5
          const z = Math.sin(angle) * 1.5
          const yOffset = Math.sin(i * 0.8) * 0.25

          return (
            <group key={i} position={[x, 1.8 + yOffset, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
              {/* Pole */}
              <mesh position={[0, 0.7, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.3} />
              </mesh>

              {/* Horse Body */}
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.25, 0.35, 0.5]} />
                <meshStandardMaterial color={['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'][i % 4]} />
              </mesh>

              {/* Horse Head */}
              <mesh position={[0, 0.15, 0.25]} castShadow>
                <boxGeometry args={[0.15, 0.2, 0.15]} />
                <meshStandardMaterial color={['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'][i % 4]} />
              </mesh>

              {/* Horse Legs */}
              <mesh position={[-0.08, -0.25, 0.1]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
              <mesh position={[0.08, -0.25, 0.1]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
              <mesh position={[-0.08, -0.25, -0.1]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
              <mesh position={[0.08, -0.25, -0.1]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Lights around the top */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2

        return (
          <mesh key={i} position={[x, 4.2, z]} castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF1493' : '#00CED1'}
              emissive={i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF1493' : '#00CED1'}
              emissiveIntensity={0.7}
            />
          </mesh>
        )
      })}

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
        <boxGeometry args={[5, 6, 5]} />
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

export default InteractiveCarousel
