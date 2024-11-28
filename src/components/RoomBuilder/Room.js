function Room() {
    return (
      <>
        {/* Floor */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f8f8f8" />
        </mesh>
        {/* Walls */}
        <mesh position={[0, 2.5, -5]}>
          <boxGeometry args={[10, 5, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[10, 5, 0.1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </>
    );
  }
  
  export default Room;
  