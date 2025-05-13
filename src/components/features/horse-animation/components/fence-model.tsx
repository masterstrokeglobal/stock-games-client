import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

type FenceModelProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

// Load the model once outside the component
let cachedModel: THREE.Group | null = null;

const FenceModel: React.FC<FenceModelProps> = ({ position, rotation, scale }) => {
  const { scene } = useGLTF("/bar_fence.glb");
  const modelRef = useRef<THREE.Group>(null);
  
  // Detect if on mobile
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && 
      (window.innerWidth < 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);
  
  // Create an optimized model instance
  const model = useMemo(() => {
    // Use the cached model if available
    if (!cachedModel) {
      // Clone the scene only once
      cachedModel = scene.clone();
      
      // Apply optimizations to the model
      cachedModel.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          // Optimize geometry
          if (object.geometry) {
            object.geometry.setDrawRange(0, Infinity); // Ensure all vertices are drawn
            
            // For mobile, use a simpler version of the mesh if available
            if (isMobile) {
              // Reduce geometry detail
              if (object.geometry instanceof THREE.BufferGeometry) {
                // Enable mergeVertices to reduce vertex count
                object.geometry = object.geometry.clone();
                
                // If this is a detailed mesh with lots of vertices, simplify it
                if (object.geometry.attributes.position.count > 1000) {
                  // Use a less detailed version if possible
                  // For example, by removing every other vertex
                  // This is a simplified example - in practice, you'd use a proper LOD system
                  const oldPositions = object.geometry.attributes.position.array;
                  const oldUvs = object.geometry.attributes.uv?.array;
                  const oldNormals = object.geometry.attributes.normal?.array;
                  
                  // Create new arrays with half the vertices
                  const newPositions = new Float32Array(Math.floor(oldPositions.length / 2));
                  const newUvs = oldUvs ? new Float32Array(Math.floor(oldUvs.length / 2)) : undefined;
                  const newNormals = oldNormals ? new Float32Array(Math.floor(oldNormals.length / 2)) : undefined;
                  
                  // Copy every other vertex
                  for (let i = 0, j = 0; i < oldPositions.length; i += 6, j += 3) {
                    newPositions[j] = oldPositions[i];
                    newPositions[j + 1] = oldPositions[i + 1];
                    newPositions[j + 2] = oldPositions[i + 2];
                    
                    if (newUvs && oldUvs) {
                      const uvIndex = Math.floor(i / 3 * 2);
                      const newUvIndex = Math.floor(j / 3 * 2);
                      if (uvIndex < oldUvs.length - 1 && newUvIndex < newUvs.length - 1) {
                        newUvs[newUvIndex] = oldUvs[uvIndex];
                        newUvs[newUvIndex + 1] = oldUvs[uvIndex + 1];
                      }
                    }
                    
                    if (newNormals && oldNormals) {
                      newNormals[j] = oldNormals[i];
                      newNormals[j + 1] = oldNormals[i + 1];
                      newNormals[j + 2] = oldNormals[i + 2];
                    }
                  }
                  
                  // Update geometry attributes
                  object.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
                  if (newUvs) {
                    object.geometry.setAttribute('uv', new THREE.BufferAttribute(newUvs, 2));
                  }
                  if (newNormals) {
                    object.geometry.setAttribute('normal', new THREE.BufferAttribute(newNormals, 3));
                  }
                }
              }
            }
          }
          
          // Optimize materials for both desktop and mobile
          if (object.material) {
            // Create a new material to avoid modifying the original
            const material = object.material.clone();
            
            // General optimizations
            material.fog = false; // Disable fog
            material.flatShading = true; // Use flat shading (faster)
            
            // Mobile-specific optimizations
            if (isMobile) {
              material.precision = "lowp"; // Use low precision shaders
              material.dithering = false; // Disable dithering
              
              // If it's a standard material, reduce quality settings
              if (material instanceof THREE.MeshStandardMaterial) {
                material.roughness = 1; // Simplify lighting calculations
                material.metalness = 0; // Simplify lighting calculations
                material.envMapIntensity = 0; // Disable environment maps
                material.aoMapIntensity = 0; // Disable ambient occlusion
                
                // Reduce texture quality if there are textures
                if (material.map) {
                  material.map.minFilter = THREE.NearestFilter;
                  material.map.magFilter = THREE.NearestFilter;
                  material.map.anisotropy = 1;
                }
              }
            }
            
            object.material = material;
          }
        }
      });
    }
    
    // Return an instance of the cached model
    return cachedModel.clone();
  }, [scene, isMobile]);
  
  // Apply transformations directly
  if (model) {
    model.position.set(...position);
    model.rotation.set(...rotation);
    model.scale.set(...scale);
  }
  
  return <primitive object={model} ref={modelRef} />;
};

// Preload the model
useGLTF.preload("/bar_fence.glb");

export default FenceModel;