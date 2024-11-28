import React from 'react';

function Wall3D({ start, end }) {
  const width = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
  );

  return (
    <mesh position={[(start[0] + end[0]) / 2, 1, (start[1] + end[1]) / 2]}>
      <boxGeometry args={[width, 2, 0.2]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export default Wall3D;
