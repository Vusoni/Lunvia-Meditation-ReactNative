import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { ConversationResponse } from "../../../utils/types"
import Button from "../Button"
import { Gradient } from "../gradient"


export default function SummaryScreen() {
    // Using aparams get conversation id
    const { conversationId } = useLocalSearchParams()
    const [conversation, setConversation] = useState<ConversationResponse>();

    // Router
    const router = useRouter()
    

    useEffect(() => {
        getSummary()
    }, [])


    // Get Summary function
    async function getSummary() {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/conversations?conversationId=${conversationId}`      
    );
    const data: {conversation: ConversationResponse } = await response.json();
    setConversation(data.conversation)
    }


    //TODO: User Interface
    return (
        <>
            <Gradient position="bottom" isSpeaking={false} />
            <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{paddingHorizontal: 16}}
            >
                {/* Provide Details about conversation */}
                {conversation?.status !== "done" && (
                    <View style={{ gap: 16, paddingBottom: 16 }}>
                      <Text style={styles.title}>We are processing your call...</Text>
                      <Text style={styles.subtitle}>This may take a few minutes.</Text>
                      <Text style={styles.subtitle}>
                        Current status: {conversation?.status}
                      </Text>
                      <Button onPress={getSummary}>Refresh</Button>
                    </View>
                  )}
                  
                  {conversation?.status === "done" && (
                    <View style={{ gap: 16, paddingBottom: 16 }}>
                      <Text style={styles.caption}>{conversationId}</Text>
                  
                      <Text style={styles.title}>
                        {conversation?.analysis?.call_summary_title}
                      </Text>
                  
                      <Text style={styles.subtitle}>
                        {conversation?.analysis?.transcript_summary.trim()}
                      </Text>
                  
                      <Text style={styles.title}>Stats</Text>
                  
                      <Text style={styles.subtitle}>
                        {conversation?.metadata?.call_duration_secs} seconds
                      </Text>
                  
                      <Text style={styles.subtitle}>
                        {conversation?.metadata?.cost} tokens
                      </Text>

                        <Text style={styles.subtitle}>
                        {new Date(
                            conversation?.metadata.start_time_unix_secs! * 1000
                        ).toLocaleString()}
                        </Text>

                        <Text style={styles.title}>Transcript</Text>

                        <Text style={styles.subtitle}>
                        {conversation?.transcript.map((t) => t.message).join("\n")}
                        </Text>

                        </View>
                        )}

                        <View style={{ alignItems: "center" }}>
                        <Button onPress={() => router.dismissAll()}>
                            Save and continue
                        </Button>
                    </View>
                </ScrollView>
        </>
    );
}




//TODO: Styles
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
    },
    caption: {
        fontSize: 12,
        color: "gray",
    }
})


