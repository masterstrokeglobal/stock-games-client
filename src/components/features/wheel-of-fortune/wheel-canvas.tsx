import { RoundRecord } from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect } from "react";
import * as THREE from 'three';

interface WheelCanvasProps {
  isSpinning: boolean;
  roundRecord?: RoundRecord;
  winningMarketId: number[] | null;
  onSpinComplete?: () => void;
  modelUrl?: string; // Add this prop to specify the GLB model URL
  hdriUri?: string;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  isSpinning,
  roundRecord,
  winningMarketId,
  onSpinComplete,
  modelUrl = "/models/fortuneWheel/FortuneWheel.glb", // Default model path
  hdriUri = "/models/fortuneWheel/hdri2.exr", // Changed from .exr to .hdr
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hdriLoaded, setHdriLoaded] = useState(false);

  // State to track wheel rotation in degrees (0-359)
  const [wheelRotationDegrees, setWheelRotationDegrees] = useState<number>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('wheelRotationDegrees');
    return saved ? parseFloat(saved) : 0;
  });

  const stocks: MarketItem[] = roundRecord?.market || [];

  // GLB Loader function
  const loadGLBModel = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Import GLTFLoader dynamically
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();

      return new Promise<THREE.Group>((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            resolve(gltf.scene);
          },
          (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (err) {
      throw new Error(`Failed to load model: ${err}`);
    }
  }, []);

  // HDRI Environment Loader function
  const loadHDRIEnvironment = useCallback(async (scene: THREE.Scene, renderer: THREE.WebGLRenderer, hdriUrl: string) => {
    try {
      console.log('Attempting to load HDRI from:', hdriUrl);
      
      // Determine file extension to choose appropriate loader
      const fileExtension = hdriUrl.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'hdr') {
      console.log('Loading EXR file 1:', hdriUrl);
        // Use RGBELoader for HDR files
        const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js');
        const loader = new RGBELoader();
        
        return new Promise<void>((resolve, reject) => {
          loader.load(
            hdriUrl,
            (texture) => {
              console.log('HDR texture loaded successfully');
              
              texture.mapping = THREE.EquirectangularReflectionMapping;
              texture.colorSpace = THREE.LinearSRGBColorSpace;
              
              scene.environment = texture;
              scene.background = texture;
              
              renderer.toneMapping = THREE.ACESFilmicToneMapping;
              renderer.toneMappingExposure = 1.0;
              renderer.outputColorSpace = THREE.SRGBColorSpace;
              
              setHdriLoaded(true);
              resolve();
            },
            (progress) => {
              const percentage = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
              console.log('HDR Loading progress:', percentage + '%');
            },
            (error) => {
              console.error('Failed to load HDR:', error);
              setHdriLoaded(false);
              resolve();
            }
          );
        });
      } else if (fileExtension === 'exr') {
      console.log('Loading EXR file 2:', hdriUrl);
        // Use EXRLoader for EXR files
        const { EXRLoader } = await import('three/examples/jsm/loaders/EXRLoader.js');
        const loader = new EXRLoader();
        
        return new Promise<void>((resolve, reject) => {
          loader.load(
            hdriUrl,
            (texture) => {
              console.log('EXR texture loaded successfully');
              
              texture.mapping = THREE.EquirectangularReflectionMapping;
              texture.colorSpace = THREE.LinearSRGBColorSpace;
              
              scene.environment = texture;
            //   scene.background = texture;
              
              renderer.toneMapping = THREE.ACESFilmicToneMapping;
              renderer.toneMappingExposure = 1.0;
              renderer.outputColorSpace = THREE.SRGBColorSpace;
              
              setHdriLoaded(true);
              resolve();
            },
            (progress) => {
              const percentage = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
              console.log('EXR Loading progress:', percentage + '%');
            },
            (error) => {
              console.error('Failed to load EXR:', error);
              setHdriLoaded(false);
              resolve();
            }
          );
        });
      } else {
        // Try to load as a regular texture (JPG, PNG, etc.) and use as environment
        const textureLoader = new THREE.TextureLoader();
        
        return new Promise<void>((resolve, reject) => {
          textureLoader.load(
            hdriUrl,
            (texture) => {
              console.log('Regular texture loaded as environment');
              
              texture.mapping = THREE.EquirectangularReflectionMapping;
              texture.colorSpace = THREE.SRGBColorSpace;
              
              scene.environment = texture;
            //   scene.background = texture;
              
              renderer.toneMapping = THREE.ACESFilmicToneMapping;
              renderer.toneMappingExposure = 1.0;
              renderer.outputColorSpace = THREE.SRGBColorSpace;
              
              setHdriLoaded(true);
              resolve();
            },
            (progress) => {
              console.log('Texture Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
              console.error('Failed to load texture as environment:', error);
              setHdriLoaded(false);
              resolve();
            }
          );
        });
      }
    } catch (err) {
      console.error('HDRI loader error:', err);
      console.warn('HDRI loader not available, using basic lighting');
      setHdriLoaded(false);
    }
  }, []);

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x202020); // Remove background for transparency

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45, // FOV similar to GLTF viewer
      rect.width / rect.height,
      0.1,
      1000
    );
    // Position camera in front of the model
    camera.position.set(0, 0, 5);

    // Renderer using the existing canvas
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true,
      alpha: true // Enable alpha for transparency
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Initial renderer settings (will be updated when HDRI loads)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Basic lighting setup (fallback and supplement to HDRI)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    directionalLight1.shadow.camera.near = 0.1;
    directionalLight1.shadow.camera.far = 50;
    directionalLight1.shadow.camera.left = -10;
    directionalLight1.shadow.camera.right = 10;
    directionalLight1.shadow.camera.top = 10;
    directionalLight1.shadow.camera.bottom = -10;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Camera looks at the center
    camera.lookAt(0, 0, 0);

    // Load HDRI environment after scene is set up
    if (hdriUri) {
      loadHDRIEnvironment(scene, renderer, hdriUri).catch(err => {
        console.error('HDRI loading failed:', err);
      });
    }
  }, [hdriUri, loadHDRIEnvironment]);

  // Load font and create text geometry
  const loadFontAndCreateText = useCallback(async (scene: THREE.Scene, markets: MarketItem[]) => {
    try {
      // Import FontLoader and TextGeometry
      const { FontLoader } = await import('three/examples/jsm/loaders/FontLoader.js');
      const { TextGeometry } = await import('three/examples/jsm/geometries/TextGeometry.js');
      
      const fontLoader = new FontLoader();
      
      return new Promise<THREE.Group>((resolve) => {
        fontLoader.load(
          'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
          (font) => {
            const textGroup = new THREE.Group();
            textGroup.name = 'MarketNamesGroup';
            
            const totalMarkets = markets.length;
            const segmentAngle = (2 * Math.PI) / totalMarkets;
            const offset = segmentAngle / 2; // Remove the -1 to properly center on segments
            
            markets.forEach((market, index) => {
              const angle = (index / totalMarkets) * Math.PI * 2 + offset;
              
              // Create text geometry with adjusted settings for better spacing
              const textGeometry = new TextGeometry(market.code || market.name || `Market ${index + 1}`, {
                font: font,
                size: 0.08, // Smaller size to prevent overlap
                depth: .01,
                curveSegments: 20,
                bevelEnabled: false 
              });
              
              // Center the text geometry properly
              textGeometry.computeBoundingBox();
              const boundingBox = textGeometry.boundingBox!;
              const textWidth = boundingBox.max.x - boundingBox.min.x;
              const textHeight = boundingBox.max.y - boundingBox.min.y;
              
              // Center both horizontally and vertically
              textGeometry.translate(-textWidth / 2 - 0.27, -textHeight / 2, 0);
              
              // Create material
              const textMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x000000,
                metalness: 0.1,
                roughness: 0.5,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                polygonOffset: true,
                polygonOffsetFactor: 1,
              });
              
              // Create mesh
              const textMesh = new THREE.Mesh(textGeometry, textMaterial);
              
              // Position text with better radius calculation to prevent overlap
              const radiusOnFace = 1.2; // Increased radius to give more space
              textMesh.position.set(
                Math.cos(angle) * radiusOnFace,
                Math.sin(angle) * radiusOnFace,
                0.05
              );
              
              // Rotate text to face outward like spokes
              textMesh.rotation.z = angle;
              
              // Add market data for reference
              (textMesh as any).marketData = market;
              
              textGroup.add(textMesh);
            });
            
            resolve(textGroup);
          },
          (progress) => {
            console.log('Font loading progress:', progress);
          },
          (error) => {
            console.error('Font loading error:', error);
            // Return empty group if font fails to load
            const emptyGroup = new THREE.Group();
            emptyGroup.name = 'MarketNamesGroup';
            resolve(emptyGroup);
          }
        );
      });
    } catch (err) {
      console.error('Error loading font:', err);
      const emptyGroup = new THREE.Group();
      emptyGroup.name = 'MarketNamesGroup';
      return emptyGroup;
    }
  }, []);

  // Load and add model to scene
  const loadModel = useCallback(async () => {
    if (!sceneRef.current || !modelUrl) return;

    try {
      const model = await loadGLBModel(modelUrl);
      
      // Center the model more precisely
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Move model so its center is at origin (0, 0, 0)
      model.position.set(-center.x, -center.y, -center.z);

      // Scale the model to fit nicely in view
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.5 / maxDim; // Slightly larger scale for better visibility
      model.scale.setScalar(scale);

      // Ensure the model is positioned at the world origin after scaling
      model.position.multiplyScalar(scale);

      // Enable shadows and configure materials for better HDRI interaction
      
      // Function to build hierarchical structure
      const buildHierarchy = (object: THREE.Object3D): any => {
        const nodeInfo = {
          name: object.name || 'unnamed',
          children: [] as any[]
        };

        // Recursively process children
        object.children.forEach(child => {
          nodeInfo.children.push(buildHierarchy(child));
        });

        return nodeInfo;
      };

      // Build and log the complete hierarchy
      const modelHierarchy = buildHierarchy(model);
      console.log('Complete Model Hierarchy:', modelHierarchy);
      
      // Store references to objects that should spin, but don't move them
      const objectsToSpin = ['InnerLight', 'Plates', 'WheelStopper'];
      const spinningObjects: THREE.Object3D[] = [];
      
      model.traverse((child) => {
        if (objectsToSpin.includes(child.name)) {
          spinningObjects.push(child);
        }
      });
      
      // Store the spinning objects reference in the model for animation
      (model as any).spinningObjects = spinningObjects;
      
      console.log('Found spinning objects:', spinningObjects.map(obj => obj.name));
      
      // Create and add market names text
      if (stocks.length > 0) {
        try {
          const textGroup = await loadFontAndCreateText(sceneRef.current, stocks);
          sceneRef.current.add(textGroup);
          
          // Add text group to spinning objects so it rotates with the wheel
          spinningObjects.push(textGroup);
          (model as any).spinningObjects = spinningObjects;
          
          console.log('Added market names text group');
        } catch (error) {
          console.error('Failed to create market names text:', error);
        }
      }

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Ensure materials can receive environment lighting
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                  mat.envMapIntensity = 1.0;
                  mat.needsUpdate = true;
                }
              });
            } else if (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshPhysicalMaterial) {
              child.material.envMapIntensity = 1.0;
              child.material.needsUpdate = true;
            }
          }
        }
      });

      sceneRef.current.add(model);
      modelRef.current = model;
      setIsLoading(false);
      console.log('Model loaded successfully');
    } catch (err) {
      console.error('Model loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load model');
      setIsLoading(false);
    }
  }, [modelUrl, loadGLBModel, stocks, loadFontAndCreateText]);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Rotate the spinning group clockwise when spinning
    if (isSpinning && modelRef.current) {
      const spinningObjects = (modelRef.current as any).spinningObjects;
      if (spinningObjects) {
        const rotationIncrement = -0.08; // Clockwise rotation (negative for clockwise)
        
        spinningObjects.forEach((obj: THREE.Object3D) => {
          // obj.rotation.z += rotationIncrement;
        });
        
        // Convert rotation increment from radians to degrees
        const degreesIncrement = (rotationIncrement * 180) / Math.PI;
        
        // Update rotation state in degrees with modulo 360
        setWheelRotationDegrees(prevDegrees => {
          const newDegrees = (prevDegrees + Math.abs(degreesIncrement)) % 360;
          // Save to localStorage
          localStorage.setItem('wheelRotationDegrees', newDegrees.toString());
          return newDegrees;
        });
      }
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    frameRef.current = requestAnimationFrame(animate);
  }, [isSpinning]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    cameraRef.current.aspect = rect.width / rect.height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(rect.width, rect.height);
  }, []);

  // Setup effect
  useEffect(() => {
    initScene();
    loadModel();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initScene, loadModel, handleResize]);

  // Start animation loop
  useEffect(() => {
    animate();
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [animate]);

  // Handle spin completion
  useEffect(() => {
    if (!isSpinning && onSpinComplete) {
      const timer = setTimeout(() => {
        onSpinComplete();
      }, 500); // Small delay after spin stops

      return () => clearTimeout(timer);
    }
  }, [isSpinning, onSpinComplete]);

  // Log rotation changes for debugging
  useEffect(() => {
    // console.log('Wheel rotation degrees:', wheelRotationDegrees);
  }, [wheelRotationDegrees]);

  if (!roundRecord || stocks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-gray-500">No market data available</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center min-h-[400px] min-w-[400px]">
      <canvas 
        ref={canvasRef}
        className="w-full h-full max-h-full max-w-full"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Loading 3D model...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-red-400">Error: {error}</div>
        </div>
      )}
    </div>
  );
};