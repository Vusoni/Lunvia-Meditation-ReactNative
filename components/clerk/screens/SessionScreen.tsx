import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import { Text, View } from "react-native";
import { Button } from "../components/Button";

//TODO Session Screen
export default function SessionScreen() {


    // Clerk - Hook that return a user
    const {user} = useUser()

    // Elevenlabs hook
    const conversation = useConversation({ 
            onConnect: () => console.log('Connected to conversation'),
            onDisconnect: () => console.log('Disconnected from conversation'),
            onMessage: (message) => console.log('Received message:', message),
            onError: (error) => console.error('Conversation error:', error),
            onModeChange: (mode) => console.log('Conversation mode changed:', mode),
            onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
            onCanSendFeedbackChange: (prop) =>
              console.log('Can send feedback changed:', prop.canSendFeedback),
            onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),
    });


    //TODO Start Conversation & AI Agent
    const startConversation = async () => {
        try {
            await conversation.startSession({
                agentId: process.env.EXPO_PUBLIC_AGENT_ID, // Agent Id

                // Dynamic Variables test
                dynamicVariables: {
                    user_name: user?.username ?? "User",
                    session_title: "test",
                    session_description: "test",
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    const endConversation = async () => {
        try {
            await conversation.endSession()
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <View>
            <Text>Session Screen</Text>
            <Button title="Start Conversation" onPress={startConversation} />
            <Button title="End Conversation" onPress={endConversation} color={"red"} />
        </View>
    )
}