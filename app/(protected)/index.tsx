import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { sessions } from "../../utils/sessions";



export default function Index() {
  // Router to navigate to session screen
  const router = useRouter()

  
  return (
      <ParallaxScrollView>
        <Text style={styles.title}>Explore Sessions</Text>
        <ScrollView contentContainerStyle={{
          paddingLeft: 16,
          gap: 16,
        }}
        horizontal
        contentInsetAdjustmentBehavior="automatic"
        showsHorizontalScrollIndicator={false}
        >
          {sessions.map((session) => (
            <Pressable
            key={session.id}
            style={styles.sessionContainer}
            onPress={() =>
              router.navigate({
                pathname: "/session",
                params: {sessionId: session.id },
            })
          }
        >
          <Image
          source={session.image}
          style={styles.sessionImage}
          contentFit="cover"
          transition={1000}
          placeholder={{ blurhash }}
          />

          <View
            style={{ 
              position: "absolute",
              width: "100%",
              height: "100%",
              experimental_backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)",
              borderRadius: 16
            }}
            >

                <Text style={styles.sessionTitle}>{session.title}</Text>
              </View>
            </Pressable>
            ))}
        </ScrollView>
        <Text style={styles.title}>Recents</Text>
      </ParallaxScrollView> 
  );
}


// Styles 
const styles = StyleSheet.create({
  title: {
    fontSize: 24, fontWeight: "bold", padding: 16
  },
  sessionContainer: {
    position: "relative", // absolute position from sessionTitle will be align to this container
  },
  sessionImage: {
    width: 255,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },
  sessionTitle: {
    position: "absolute",
    width: "100%",
    bottom: 16,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  }

})