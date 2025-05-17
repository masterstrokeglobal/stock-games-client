import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import FenceModel from './fence-model';

interface FenceRowProps {
  count: number;
  spacing: number;
  x: number;
  visibilityDistance?: number;
  mobileOptimization?: boolean;
}

const FenceRow: React.FC<FenceRowProps> = ({
  count,
  spacing,
  x,
  visibilityDistance = 800,
  mobileOptimization = true,
}) => {
  const fenceRowRef = useRef<THREE.Group>(null);
  const speed = 0.90;
  const initialZPosition = -300;
  
  // Get access to the Three.js renderer and global state
  const { gl, size } = useThree();
  
  // Detect if device is mobile based on screen width or user agent
  const isMobile = useMemo(() => {
    const isMobileBySize = size.width < 768;
    const isMobileByUA = typeof navigator !== 'undefined' && 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileBySize || isMobileByUA;
  }, [size.width]);
  
  // Create reusable vector to avoid garbage collection
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  
  // Apply mobile optimizations
  useEffect(() => {
    if (!mobileOptimization || !isMobile) return;
    
    // Store original settings to restore later
    const originalPixelRatio = gl.getPixelRatio();
    const originalShadowsEnabled = gl.shadowMap.enabled;
    
    // Apply mobile-specific renderer optimizations
    gl.setPixelRatio(Math.min(0.7, originalPixelRatio)); // 70% of native pixel ratio
    gl.shadowMap.enabled = false; // Disable shadows on mobile
    
    // Reduce texture quality
    const originalAnisotropy = gl.capabilities.getMaxAnisotropy();
    gl.capabilities.getMaxAnisotropy = () => Math.min(2, originalAnisotropy);
    
    // Restore on cleanup
    return () => {
      gl.setPixelRatio(originalPixelRatio);
      gl.shadowMap.enabled = originalShadowsEnabled;
      gl.capabilities.getMaxAnisotropy = () => originalAnisotropy;
    };
  }, [gl, isMobile, mobileOptimization]);
  
  // Adjust number of visible fences based on mobile device
  const effectiveCount = isMobile && mobileOptimization ? Math.floor(count * 0.6) : count;
  
  useFrame(({ camera }) => {
    if (!fenceRowRef.current) return;

    // Move the entire row
    const newZ = fenceRowRef.current.position.z - speed;
    fenceRowRef.current.position.z = newZ;
    
    if (newZ < -2000) {
      fenceRowRef.current.position.z = 0;
    }
    
    // Adjust visibility distance based on device type
    const effectiveVisibilityDistance = 
      isMobile && mobileOptimization ? visibilityDistance * 0.6 : visibilityDistance;
    
    // Check visibility based only on distance to camera
    fenceRowRef.current.children.forEach((fence) => {
      fence.getWorldPosition(tempVector);
      const distanceToCamera = camera.position.distanceTo(tempVector);
      const shouldBeVisible = distanceToCamera < effectiveVisibilityDistance;
      
      if (fence.visible !== shouldBeVisible) {
        fence.visible = shouldBeVisible;
      }
    });
  });

  return (
    <group ref={fenceRowRef}>
      {Array.from({ length: effectiveCount }).map((_, index) => {
        const zPos = initialZPosition + (index * spacing);
        return (
          <group
            key={`fence-${index}`}
            position={[x, 0, zPos]}
            visible={true}
          >
            <FenceModel
              rotation={[0, 0, 0]}
              scale={[12, 12, 12]}
              position={[0, 0, 0]}
            />
          </group>
        );
      })}
    </group>
  );
};

export default FenceRow;