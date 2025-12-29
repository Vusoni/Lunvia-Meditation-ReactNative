import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import * as Brightness from "expo-brightness";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { sessions } from "../../../utils/sessions";
import { Button } from "../components/Button";
import { Gradient } from "../gradient";


//TODO Session Screen
export default function SessionScreen() {


    // Clerk - Hook that return a user
    const {user} = useUser()
    const {sessionId} = useLocalSearchParams()
    // Grab sessios by session id
    const session = sessions.find((s) => s.id === Number(sessionId)) ?? sessions[0]


    // Show different state
    const [isStarting, setIsStarting] = useState(false)
    const [conversationId, setConversationId] = useState<String | null>(null) // used to get the information of the conversation once the conversation is done.


    if (!sessionId) {
        return <Redirect href="/" />
    }

    // Elevenlabs hook
    const conversation = useConversation({ 
            onConnect: ({conversationId}) => {
                setConversationId(conversationId);
            },
            onDisconnect: () => console.log('Disconnected from conversation'),
            onMessage: (message) => console.log('Received message:', message),
            onError: (error) => console.error('Conversation error:', error),
            onModeChange: (mode) => console.log('Conversation mode changed:', mode),
            onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
            onCanSendFeedbackChange: (prop) =>
              console.log('Can send feedback changed:', prop.canSendFeedback),
            onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),

            // Client tools - To lower the brightness
            clientTools: {
                handleSetBrightness: async (parameters: unknown) => {
                    const { brightnessValue } = parameters as { brightnessValue: number }
                    console.log("🌤️ Setting brightness to, ", { brightnessValue })
                    // Expo Brightness
                    const {status } = await Brightness.requestPermissionsAsync() 
                    if (status === "granted") {
                        await Brightness.setSystemBrightnessAsync(brightnessValue)
                        return brightnessValue
                    }
                }
            }
    });


    //TODO: Start Conversation & AI Agent
    const startConversation = async () => {
        if (isStarting) return

        try {
            setIsStarting(true)
            await conversation.startSession({
                agentId: process.env.EXPO_PUBLIC_AGENT_ID, // Agent Id
                // Dynamic Variables test
                dynamicVariables: {
                    user_name: user?.username ?? "User",
                    session_title: session.title,
                    session_description: session.description,
                },
            });
        } catch (e) {
            console.log(e)
        } finally {
            setIsStarting(false)
        }
    }

    //TODO: End Conversation
    const endConversation = async () => {
        try {
            await conversation.endSession()
            router.push({
                pathname: "/summary",
                params: { conversationId },
            })
        } catch(e) {
            console.log(e)
        }
    }

    // can start & can end
    const canStart = conversation.status === "disconnected" && !isStarting
    const canEnd = conversation.status === "connected"


    //TODO: User Interface
    return (
        <>
        <Gradient position="top" isSpeaking={ conversation.status === "connected" || conversation.startSession === "connecting" }/>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, }}>
            <Text style={{ fontSize: 32, fontWeight: "bold"}}>
                {session.title}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 500, opacity: 0.5 }}>
                {session.description}
            </Text>
            <Button onPress={canStart ? startConversation : endConversation} disabled={!canStart && !canEnd }>{canStart ? "Start Conversation" : "End Conversation" }</Button>
        </View>
        </>
    )
}