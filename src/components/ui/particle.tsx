import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesContainer = ({
    className,
}: PropsWithClassName) => {
    // init
    const particlesInit = useCallback(async (engine: any) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async () => { }, []);

    return (
        <Particles
            className={cn("absolute translate-z-0", className)}
            id="tsparticles2"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: false,
                particles: {
                    number: {
                        value: 400,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#ffd700'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        },
                        polygon: {
                            nb_sides: 5
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 6,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 2,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: false
                    },
                    move: {
                        enable: true,
                        speed: 3,
                        direction: 'bottom',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        repulse: {
                            distance: 100,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            }}
        />
    );
};

export default ParticlesContainer;