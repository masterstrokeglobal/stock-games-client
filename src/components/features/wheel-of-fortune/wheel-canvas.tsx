import { RoundRecord } from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect } from "react";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface WheelCanvasProps {
  isSpinning: boolean;
  roundRecord?: RoundRecord;
  winningMarketId: number[] | null;
  onSpinComplete?: () => void;
  modelUrl?: string;
  hdriUri?: string;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  isSpinning,
  roundRecord,
  winningMarketId,
  onSpinComplete,
  modelUrl = "/models/fortuneWheel/FortuneWheel_v3.glb",
  hdriUri = "/models/fortuneWheel/hdri2.exr",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const spinningObjectsRef = useRef<THREE.Object3D[]>([]);
  const textGroupRef = useRef<THREE.Group | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  
  // GSAP animation state
  const currentSpeedRef = useRef<number>(0);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [marketNames, setMarketNames] = useState<string[]>([]);

  // State to track wheel rotation in degrees (0-359)
  const [wheelRotationDegrees, setWheelRotationDegrees] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wheelRotationDegrees');
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });

  // State to track target rotation for stopping
  const targetRotationRef = useRef<number | null>(null);

  const stocks: MarketItem[] = roundRecord?.market || [];

  // Frame rate limiting
  const targetFrameRate = 60;
  const frameInterval = 1 / targetFrameRate;
  const deltaAccumulatorRef = useRef(0);

  // GSAP Animation constants
  const MAX_SPIN_SPEED = -0.1; // Maximum rotation speed
  const ACCELERATION_TIME = 3.0; // Time to reach max speed (seconds)
  const DECELERATION_TIME = 1.0; // Time to stop from max speed (seconds)

  // GLB Loader function with better error handling
  const loadGLBModel = useCallback(async (url: string): Promise<THREE.Group> => {
    try {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();

      return new Promise<THREE.Group>((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            console.log('Model loaded successfully');
            resolve(gltf.scene);
          },
          (progress) => {
            const percentage = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
            setLoadingProgress(percentage);
            console.log('Model loading progress:', percentage + '%');
          },
          (error: unknown) => {
            console.error('Model loading error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            reject(new Error(`Failed to load model: ${errorMessage}`));
          }
        );
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Failed to initialize model loader: ${errorMessage}`);
    }
  }, []);

  // HDRI Environment Loader function with fixed logic
  const loadHDRIEnvironment = useCallback(async (scene: THREE.Scene, renderer: THREE.WebGLRenderer, hdriUrl: string): Promise<void> => {
    try {
      console.log('Attempting to load HDRI from:', hdriUrl);
      
      const fileExtension = hdriUrl.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'hdr') {
        const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js');
        const loader = new RGBELoader();
        
        return new Promise<void>((resolve) => {
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
              
              resolve();
            },
            (progress) => {
              const percentage = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
              console.log('HDR Loading progress:', percentage + '%');
            },
            (error) => {
              console.error('Failed to load HDR:', error);
              resolve(); // Continue without HDRI
            }
          );
        });
      } else if (fileExtension === 'exr') {
        const { EXRLoader } = await import('three/examples/jsm/loaders/EXRLoader.js');
        const loader = new EXRLoader();
        
        return new Promise<void>((resolve) => {
          loader.load(
            hdriUrl,
            (texture) => {
              console.log('EXR texture loaded successfully');
              texture.mapping = THREE.EquirectangularReflectionMapping;
              texture.colorSpace = THREE.LinearSRGBColorSpace;
              scene.environment = texture;
              
              renderer.toneMapping = THREE.ACESFilmicToneMapping;
              renderer.toneMappingExposure = 1.0;
              renderer.outputColorSpace = THREE.SRGBColorSpace;
              
              resolve();
            },
            (progress) => {
              const percentage = progress.total > 0 ? (progress.loaded / progress.total * 100) : 0;
              console.log('EXR Loading progress:', percentage + '%');
            },
            (error) => {
              console.error('Failed to load EXR:', error);
              resolve(); // Continue without HDRI
            }
          );
        });
      } else {
        // Try to load as a regular texture
        const textureLoader = new THREE.TextureLoader();
        
        return new Promise<void>((resolve) => {
          textureLoader.load(
            hdriUrl,
            (texture) => {
              console.log('Regular texture loaded as environment');
              texture.mapping = THREE.EquirectangularReflectionMapping;
              texture.colorSpace = THREE.SRGBColorSpace;
              scene.environment = texture;
              
              renderer.toneMapping = THREE.ACESFilmicToneMapping;
              renderer.toneMappingExposure = 1.0;
              renderer.outputColorSpace = THREE.SRGBColorSpace;
              
              resolve();
            },
            undefined,
            (error) => {
              console.error('Failed to load texture as environment:', error);
              resolve(); // Continue without HDRI
            }
          );
        });
      }
    } catch (err) {
      console.error('HDRI loader error:', err);
      console.warn('HDRI loader not available, using basic lighting');
    }
  }, []);

  // Load font and create text geometry
  const loadFontAndCreateText = useCallback(async (markets: MarketItem[]): Promise<THREE.Group> => {
    try {
      const { FontLoader } = await import('three/examples/jsm/loaders/FontLoader.js');
      const { TextGeometry } = await import('three/examples/jsm/geometries/TextGeometry.js');
      
      const fontLoader = new FontLoader();
      
      return new Promise<THREE.Group>((resolve) => {
        fontLoader.load(
          'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
          (font) => {
            const textGroup = new THREE.Group();
            textGroup.name = 'MarketNamesGroup';
            
            const totalMarkets = markets.length;
            const offset =  Math.PI/48;
            
            markets.forEach((market, index) => {
              const angle = (index / totalMarkets) * Math.PI * 2 + offset ;
              
              // Create initial text geometry with placeholder
              const textGeometry = new TextGeometry('Loading...', {
                font: font,
                size: 0.08,
                depth: 0.00001,
                curveSegments: 20,
                bevelEnabled: true,
                bevelThickness: 0.002,
                bevelSize: 0.002,
                bevelOffset: 0,
                bevelSegments: 8
              });
              
              textGeometry.computeBoundingBox();
              const boundingBox = textGeometry.boundingBox!;
              const textWidth = boundingBox.max.x - boundingBox.min.x;
              const textHeight = boundingBox.max.y - boundingBox.min.y;
              
              textGeometry.translate(-textWidth / 2 - 0.27, -textHeight / 2, 0);
              
              const textMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x000000,
                metalness:1,
                // roughness: 0.5,
                // clearcoat: 1,
                // clearcoatRoughness: 0.1,
                polygonOffset: true,
                polygonOffsetFactor: 1,
              });
              
              const textMesh = new THREE.Mesh(textGeometry, textMaterial);
              
              const radiusOnFace = 1.2;
              textMesh.position.set(
                Math.cos(angle) * radiusOnFace,
                Math.sin(angle) * radiusOnFace,
                0.05
              );
              
              textMesh.rotation.z = angle;
              (textMesh as any).marketData = market;
              (textMesh as any).marketIndex = index; // Store index for updates
              (textMesh as any).font = font; // Store font for recreation
              (textMesh as any).angle = angle; // Store angle for positioning
              
              textGroup.add(textMesh);
            });
            
            resolve(textGroup);
          },
          undefined,
          (error) => {
            console.error('Font loading error:', error);
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

  // Function to update text meshes with new names
  const updateTextMeshes = useCallback(() => {
    if (!textGroupRef.current || marketNames.length === 0) return;

    textGroupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && (child as any).marketIndex !== undefined) {
        const meshIndex = (child as any).marketIndex;
        const originalText = marketNames[meshIndex] || `Market ${meshIndex + 1}`;
        
        // Truncate text if longer than 7 characters
        const newText = originalText.length > 6 
          ? originalText.substring(0, 5) + '.' 
          : originalText;
        
        // Check if text needs updating
        if ((child as any).currentText !== newText) {
          
          const font = (child as any).font;
          
          if (font) {
            // Create new geometry
            const newGeometry = new TextGeometry(newText, {
              font: font,
              size: 0.08,
              depth: 0.00001,
              curveSegments: 20,
              bevelEnabled: true,
              bevelThickness: 0.002,
              bevelSize: 0.002,
              bevelOffset: 0,
              bevelSegments: 8
            });
            
            newGeometry.computeBoundingBox();
            const boundingBox = newGeometry.boundingBox!;
            const textWidth = boundingBox.max.x - boundingBox.min.x;
            const textHeight = boundingBox.max.y - boundingBox.min.y;
            
            newGeometry.translate(-textWidth / 2 - 0.27, -textHeight / 2, 0);
            
            // Dispose old geometry and update
            if (child.geometry) child.geometry.dispose();
            child.geometry = newGeometry;
            (child as any).currentText = newText;
            
          }
        }
      }
    });
  }, [marketNames]);

  // Animation loop with frame rate limiting
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const delta = clockRef.current.getDelta();
    deltaAccumulatorRef.current += delta;

    if (deltaAccumulatorRef.current >= frameInterval) {
      // Update text meshes with current market names
      updateTextMeshes();

     const multiplier = 50
      
      // Apply rotation to spinning objects using current speed
      if (Math.abs(currentSpeedRef.current) > 0 && spinningObjectsRef.current.length > 0) {
        const rotationIncrement = currentSpeedRef.current * delta * multiplier;
        
        spinningObjectsRef.current.forEach((obj: THREE.Object3D) => {
          // Handle different objects with potentially different rotation directions
          if (obj.name === 'Plates009') {
            // Plates009 might need opposite rotation to match other elements
            obj.rotation.z -= rotationIncrement; // Reverse the rotation for plates
          } else {
            // Default rotation for other objects (InnerLight, WheelStopper, text)
            obj.rotation.z += rotationIncrement;
          }
        });
        
        // Update rotation state
        setWheelRotationDegrees(() => {
          const newDegrees = Math.abs((spinningObjectsRef.current[2].rotation.z * 180) / Math.PI % 360);
          if (typeof window !== 'undefined') {
            localStorage.setItem('wheelRotationDegrees', newDegrees.toString());
          }
          
          // Check if we've reached the target rotat          // const degreesIncrement = (rotationIncrement * 180) / Math.PI; // Convert radians to degrees
          // const newDegrees = (prevDegrees + degreesIncrement) % 360;
          // console.log("newDegrees",  newDegrees);ion (within tolerance)
          if (targetRotationRef.current !== null && isSpinning) {
            const tolerance = 5; // degrees tolerance
            const angleDifference = Math.abs(360 -newDegrees - targetRotationRef.current);
            
            if (angleDifference <= tolerance) {
              console.log("Target rotation reached! Current:", newDegrees, "Target:", targetRotationRef.current);
              // Clear the target and stop spinning immediately
              targetRotationRef.current = null;
              // Stop immediately by setting speed to 0
              currentSpeedRef.current = 0;
              isAnimatingRef.current = false;
              // Kill any active tween
              if (spinTweenRef.current) {
                spinTweenRef.current.kill();
                spinTweenRef.current = null;
              }
              // Call completion callback
              if (onSpinComplete) {
                onSpinComplete();
              }
            }
          }
          
          return newDegrees;
        });
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      deltaAccumulatorRef.current = deltaAccumulatorRef.current % frameInterval;
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [frameInterval, updateTextMeshes]);

  // GSAP-powered spin control
  const startSpinning = useCallback(() => {
    // Kill any existing tween
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    // Animate to full speed
    spinTweenRef.current = gsap.to(currentSpeedRef, {
      current: MAX_SPIN_SPEED,
      duration: ACCELERATION_TIME,
      ease: "power2.out",
      onComplete: () => {
        isAnimatingRef.current = true;
      }
    });
  }, [MAX_SPIN_SPEED, ACCELERATION_TIME]);

  const stopSpinning = useCallback(() => {
    // Kill any existing tween
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    // Animate to stop
    spinTweenRef.current = gsap.to(currentSpeedRef, {
      current: 0,
      duration: DECELERATION_TIME,
      ease: "power2.in",
      onComplete: () => {
        isAnimatingRef.current = false;
        if (onSpinComplete) {
          onSpinComplete();
        }
      }
    });
  }, [DECELERATION_TIME, onSpinComplete]);

  // Handle spin state changes
  useEffect(() => {
    // Additional safety checks before allowing spin
    if (roundRecord) {
      const currentTime = new Date().getTime();
      const placementEndTime = new Date(roundRecord.placementEndTime).getTime();
      const gameEndTime = new Date(roundRecord.endTime).getTime();
      
      // Ensure we're in the correct time window for spinning
      const isBettingClosed = currentTime >= placementEndTime;
      const isGameStillActive = currentTime < gameEndTime;
      
      // Only start spinning if all conditions are met
      if (isSpinning && isBettingClosed && isGameStillActive && !winningMarketId) {
        startSpinning();
        // Clear any existing target when starting new spin
        targetRotationRef.current = null;
      } else if (isSpinning && (!isBettingClosed || !isGameStillActive)) {
        // Don't spin if betting is still open or game is over
        return;
      }
    } else if (isSpinning) {
      // Fallback to original logic if no roundRecord
      startSpinning();
      targetRotationRef.current = null;
    }
    
    // Handle stopping logic
    if (!isSpinning && winningMarketId) {
      console.log("winning MarketID", winningMarketId);
      console.log("winner in round record", roundRecord);
      
      // Find the actual index in the markets array
      if (winningMarketId && winningMarketId.length > 0) {
        const marketIndex = roundRecord?.market?.findIndex(market => market.id === winningMarketId[0]);
        console.log("winner market index in array:", marketIndex);
        console.log("current wheel rotation (degrees):", wheelRotationDegrees);
        
        // Calculate the target rotation where winning market should be at top (0 degrees)
        if (marketIndex !== undefined && marketIndex >= 0 && roundRecord?.market) {
          const totalMarkets = roundRecord.market.length;
          const segmentAngle = 360 / totalMarkets; // degrees per segment
          const offset = segmentAngle / 2;
          const winningMarketAngle = (marketIndex / totalMarkets) * 360 + offset;
          const targetRotation = (360 - winningMarketAngle) % 360;
          // const targetRotation = (winningMarketAngle + 90) % 360 ;
          console.log("target rotation to win (degrees):", targetRotation);
          
          // Set the target rotation - the animation loop will handle stopping
          targetRotationRef.current = targetRotation;
        } else {
          // Fallback to normal stop if we can't calculate target
          stopSpinning();
        }
      } else {
        stopSpinning();
      }
    } else if (!isSpinning && !winningMarketId) {
      // Stop spinning if isSpinning is false and no winner yet
      stopSpinning();
    }
  }, [isSpinning, startSpinning, stopSpinning, winningMarketId, roundRecord, wheelRotationDegrees]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    cameraRef.current.aspect = rect.width / rect.height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(rect.width, rect.height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Kill any active GSAP tweens
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
      spinTweenRef.current = null;
    }
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      sceneRef.current.clear();
      sceneRef.current = null;
    }

    modelRef.current = null;
    textGroupRef.current = null;
    spinningObjectsRef.current = [];
    isInitializedRef.current = false;
    
    // Reset animation state
    currentSpeedRef.current = 0;
    isAnimatingRef.current = false;
  }, []);

  // Setup effect
  useEffect(() => {
    let isMounted = true;
    
    const initializeScene = async () => {
      // Clean up any existing scene first
      cleanup();
      
      if (!canvasRef.current || !isMounted) return;

      try {
        setIsLoading(true);
        setError(null);

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(
          45,
          rect.width / rect.height,
          0.1,
          1000
        );
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvas,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Lighting setup
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

        // Load HDRI environment
        if (hdriUri && isMounted) {
          try {
            await loadHDRIEnvironment(scene, renderer, hdriUri);
          } catch (err) {
            console.error('HDRI loading failed:', err);
          }
        }

        // Load model
        if (modelUrl && isMounted) {
          const model = await loadGLBModel(modelUrl);
          
          if (!isMounted || !sceneRef.current) return;
          
          // Center and scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          model.position.set(-center.x, -center.y, -center.z);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3.5 / maxDim;
          model.scale.setScalar(scale);
          model.position.multiplyScalar(scale);

          // Find spinning objects
          const objectsToSpin = ['InnerLight', 'Plates009', 'WheelStopper'];
          const spinningObjects: THREE.Object3D[] = [];
          
          model.traverse((child) => {
            if (objectsToSpin.includes(child.name)) {
              spinningObjects.push(child);
            }
            
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
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
          
          // Create and add market names text
          if (stocks.length > 0 && isMounted) {
            try {
              const textGroup = await loadFontAndCreateText(stocks);
              if (isMounted && sceneRef.current) {
                sceneRef.current.add(textGroup);
                textGroupRef.current = textGroup;
                
                // Add text group to spinning objects so it rotates with the wheel
                spinningObjects.push(textGroup);
                
                console.log('Added market names text group to spinning objects');
              }
            } catch (error) {
              console.error('Failed to create market names text:', error);
            }
          }
          
          if (isMounted && sceneRef.current) {
            spinningObjectsRef.current = spinningObjects;
            sceneRef.current.add(model);
            modelRef.current = model;
            console.log('Model loaded successfully');
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Scene initialization error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize scene');
          setIsLoading(false);
        }
      }
    };

    initializeScene();
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [modelUrl, hdriUri, stocks.length]);

  // Animation effect
  useEffect(() => {
    if (!isLoading && !error) {
      animate();
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [animate, isLoading, error]);

  // Update market names when stocks change
  useEffect(() => {
    const names = stocks.map(market => market.codeName || market.code || market.name || `Market ${market.id}`);
    // in i need to update something what i want you to do is shift the array to right i need the zero number to become 5th and 20th to be 0th 
    const shiftedNames = [...names.slice(-5), ...names.slice(0, -5)];
    setMarketNames(shiftedNames);
    console.log("Updated market names array :", names);
    console.log("Updated market names array shifted:", shiftedNames);
  }, [stocks]);

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
          <div className="flex flex-col items-center space-y-2">
            <div className="text-white">Loading 3D model...</div>
            {loadingProgress > 0 && (
              <div className="text-white text-sm">{Math.round(loadingProgress)}%</div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-red-400 text-center p-4">
            <div>Error: {error}</div>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Force re-initialization by updating a dependency
                window.location.reload();
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};