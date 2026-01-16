import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import GameEnvironment from './3D/GameEnvironment'
import Lighting from './3D/Lighting'
import Sky from './3D/Sky'

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 4, 12], fov: 55 }}
      shadows
      style={{ background: '#87CEEB' }}
    >
      <Sky />
      <Lighting />
      <GameEnvironment />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

export default Scene
