import { Blur, Canvas, RadialGradient, Rect, vec } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View, } from "react-native";
import { useSharedValue, useDerivedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";

// Grab width and height from dimension
const {width, height} = Dimensions.get("screen")


//TODO: Configs
// Visual Constants
const VISUAL_CONFIG = {
    blur: 9,
    center: { // Middle of the screen
        x: width / 2,
        y: height / 2,
    }
} as const

// Animation Constants
const ANIMATION_CONFIG = {
    durations: {
        MOUNT: 2000,
        SPEAKING_TRANSITION: 600,
        QUIET_TRANSITION: 400,
        PULSE: 1000,
    },
    spring: {
        damping: 10,
        stiffness: 50,
    },
} as const;

// Radius scaling constants - Play with that values to change speaking radius scale
const RADIUS_CONFIG = {
    minScale: 0.6,
    maxScale: 1.4,
    speakingScale: 4.0,
    quietScale: 0.6,
    baseRadius: {
        default: width,
        speaking: width / 10,
    }
} as const




//<> Functions for Radius
const calculatedRadiusBounds = (baseRadius: number) => {
    "worklet";
    return {
        min: baseRadius * RADIUS_CONFIG.minScale,
        max: baseRadius * RADIUS_CONFIG.maxScale,
    }
}

const calculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
    "worklet";
    const {min, max} = calculatedRadiusBounds(baseRadius) 
    const scale = isSpeaking // Scale to check wether the agent is speaking
        ? RADIUS_CONFIG.speakingScale
        : RADIUS_CONFIG.quietScale

    return min + (max - min) * scale
}



//<> Props & Interface to make TypeScript happy
type GradientPosition = "top" | "center" | "bottom";

interface GradientProps {
    position: GradientProps;
    isSpeaking: boolean; // When the agent is speaking - Then animate
}

const getTargetY = (pos: GradientPosition): number => {
    switch (pos) {
        case "top":
            return 0
        case "center":
            return VISUAL_CONFIG.center.y
        case "bottom":
            return height
        default:
            return VISUAL_CONFIG.center.y
    }
}

//TODO Gradient Component
export function Gradient({ position, isSpeaking }: GradientProps) {
    const animatedY = useSharedValue(0); // Allow me to manage a value and animate a value without much renders 
    const radiusScale = useSharedValue(1); // Animating gradient radius
    const baseRadiusValue = useSharedValue(RADIUS_CONFIG.baseRadius.default)
    const mountRadius = useSharedValue(0)
    const center = useDerivedValue(() => { // Animate Center
        return  vec(VISUAL_CONFIG.center.x, animatedY.value) // x axis of the center of the screen
    })

    const animatedRadius = useDerivedValue(() => {
        const {min, max} = calculatedRadiusBounds(baseRadiusValue.value)
        const calculatedRadius = min + (max - min) * radiusScale.value
        return mountRadius.value < calculatedRadius
        ? mountRadius.value
        : calculatedRadius
    })


    //TODO: UseEffects
    // useEffect to Update the value whenever the position change
    useEffect(() => {
        const targetY =getTargetY(position)
        animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring)
    }, [position, animatedY])

    // useEffect - run only once as soon as the component mounts
    useEffect(() => {
        animatedY.value = getTargetY(position)
    }, [])


    // Run only once when mount component
    useEffect(() => {
        const targetRadius = calculateTargetRadius(RADIUS_CONFIG.baseRadius.default, isSpeaking)
        mountRadius.value = withTiming(targetRadius, {
            duration: ANIMATION_CONFIG.durations.MOUNT
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect to handle isSpeaking case
    useEffect(() => {
        cosnt duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION;
        if(isSpeaking) {
            baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking)
            animatedY.value = withTiming(getTargetY("center"), { duration })
        } else {
            baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.default)
            animatedY.value = withTiming(getTargetY(position), { duration })
            
        }
    }, [ isSpeaking, baseRadiusValue, animatedY, position ])


    // Pulse Animation
    useEffect(() => {
        if (isSpeaking) {
            radiusScale.value = withRepeat(withTiming(RADIUS_CONFIG.speakingScale, { duration: ANIMATION_CONFIG.durations.PULSE}),
            -1,
            true )
        } else {
            radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, { duration: ANIMATION_CONFIG.durations.QUIET_TRANSITION })
        }
    }, [isSpeaking, radiusScale])


    //TODO: User Interface
    return (
        <View style={StyleSheet.absoluteFill}>
            <Canvas style={{ flex: 1}}>
                <Rect x={0} y={0} width={width} height={height}>
                    <RadialGradient 
                        c={center}
                        r={128} // Radius
                        colors={[Colors.mediumBlue, Colors.lightBlue, Colors.teal, Colors.iceBlue, Colors.white]} // White the rest of the screen
                        />
                        <Blur blur={VISUAL_CONFIG.blur} mode={"clamp"} /> 
                </Rect>
            </Canvas>
        </View>
    );
}




// Change Colors  -> For changing the animated circle
const Colors = {
    white: "#FFFFFF",
    teal: "#5AC8FA",
    mediumBlue: "#007AFF",
    lightBlue: "#4DA6FF",
    iceBlue: "#E6F3FF",
}