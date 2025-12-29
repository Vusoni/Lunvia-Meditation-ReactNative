import Button from "@/component/Button";
import { Image } from "expo-image";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedRef, useScrollOffset } from "react-native-reanimated";
import { sessions } from "../utils/sessions";


// Blurhash BASE64 - Expo Docs
export const blurhash =
'|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const HEADER_HEIGHT = 400


//TODO: ParallaxScrollView
export default function ParallaxScrollView({ children }: PropsWithChildren) {
    const todaySession = sessions[Math.floor(Math.random() * sessions.length )] // Number between 0 and number of sessions

    // Reference to the scroll view
    const scrollRef = useAnimatedRef<Animated.ScrollView>()
    const scrollOffset = useScrollOffset(scrollRef)

    const headerAnimatedStyle = useAnimatedStyle(() => {
        // Only apply parallax effect when pulling down (negative scroll offset)
        // When scrolling up (positive offset), behave like normal scroll item.

        const translateY =
            scrollOffset.value <= 0
                ? interpolate(
                    scrollOffset.value,
                    [-HEADER_HEIGHT, 0],
                    [-HEADER_HEIGHT / 2, 0]
                )
            : 0; // No transform when scrolling up - let natural scroll handler


        
        const scale = 
        scrollOffset.value <= 0
        ? interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0], [2, 1])
        : 1; // No scaling when scrolling up


        return {
            transform: [
                {
                    translateY, // REALLY IMPORTANT
                },
                {
                    scale,
                },
            ],
        };
    });
    

    // User Interface 
    return (
        <View style={styles.container}>
            
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                <Animated.View style={{ height: HEADER_HEIGHT, Overflow: "hidden"}, headerAnimatedStyle}>
                    {/* Image with the session of the day */}
                    
                    <Image
                        source={todaySession.image}
                        placeholder={blurhash}
                        style={{
                            width: "100%",
                            height: HEADER_HEIGHT,
                    }}
                    />
                </Animated.View>

                {/* Text with session */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        
                        <View style={{ flex: 5 }} /> {/* SPACER */}
                        <Text style={styles.headerSubtitle}>Featured Session</Text>
                        <Text style={styles.headerTitle}>{todaySession.title}</Text>
                        <Text style={styles.headerDescription}>{todaySession.description}</Text>
                            <Button>Start Session</Button>
                        <View style={{ flex: 1 }} /> {/* SPACER */}
                    </View>
                </View>
                {children}
            </Animated.ScrollView>
        </View>
    )
}



//TODO: Styles for the header
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerSubtitle: {
        fontSize: 16,
        color: "white",
        opacity: 0.5,
        fontWeight: "bold"
    },
    headerTitle: {
        fontSize: 48,
        color: "white",
        fontWeight: "bold"
    },
    headerDescription: {
        fontSize: 16,
        color: "white",
    },
    headerContainer: {
        position: "absolute",
        width: "100%",
        height: HEADER_HEIGHT,
        experimental_backgroundImage:
        "linear-gradient(to bottom, rgba(0, 0, 0, 0) rgba(0, 0, 0, 0.7)", // Linear transaprent gradient 
    },

    headerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    }
})