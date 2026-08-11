import { AppAntonioAvatar } from "@/components/ui/AppAntonioAvatar";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { AppKeyboardAvoidingComponent } from "@/components/utils/AppKeyboardAvoidingComponent";
import { AppKeyboardDismissing } from "@/components/utils/AppKeyboardDismissing";
import { AppSafeAreaComponent } from "@/components/utils/AppSafeAreaComponent";
import { AppLayoutConstants } from "@/constants/layout";
import { useSendChatMessage } from "@/hooks/mutations/use-chat-mutations";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { useChatStore } from "@/hooks/use-chat-store";
import { ChatMessage, ChatMessageRoles } from "@/models/ChatMessage";
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, TextInput as RNTextInput, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { IconButton, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const theme = useAppTheme();

  useEffect(() => {
    const animateDot = (dot: Animated.Value) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ]),
      );
    };

    const anim1 = animateDot(dot1);
    const anim2 = animateDot(dot2);
    const anim3 = animateDot(dot3);

    setTimeout(() => anim1.start(), 0);
    setTimeout(() => anim2.start(), 200);
    setTimeout(() => anim3.start(), 400);

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const Dot = ({ anim }: { anim: Animated.Value }) => (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.onSurfaceVariant,
        marginHorizontal: 2,
        transform: [{ translateY: anim }],
      }}
    />
  );

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 4, alignItems: "center", justifyContent: "center" }}>
      <Dot anim={dot1} />
      <Dot anim={dot2} />
      <Dot anim={dot3} />
    </View>
  );
};

export default function ChatAssistantScreen() {
  const theme = useAppTheme();
  const [inputText, setInputText] = useState("");
  const { messages, setMessages, threadId, setThreadId } = useChatStore();
  const flatListRef = useRef<FlatList>(null);
  const sendMessage = useSendChatMessage();
  const toast = useAppToast();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;

  const handleSend = () => {
    const text = inputText.trim();

    if (!text) return;

    setInputText("");

    const optimisticId = Math.random().toString();
    const optimisticMessage: ChatMessage = {
      id: optimisticId,
      content: text,
      role: ChatMessageRoles.User,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [optimisticMessage, ...prev]);

    sendMessage.mutate(
      { content: text, threadId },
      {
        onSuccess: (data) => {
          console.log(JSON.stringify(data, null, 2));

          if (data.thread?.id && !threadId) {
            setThreadId(data.thread.id);
          }

          const assistantMessage: ChatMessage = {
            id: Math.random().toString(),
            ...data.message,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [assistantMessage, ...prev]);
        },
        onError: (error: any) => {
          setInputText(text);
          setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
          toast.error({
            title: "Ops...",
            description: error?.response?.data?.message || "Não foi possível enviar a mensagem.",
            topOffset: toastOffset,
          });
        },
      },
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";

    return (
      <View style={{ flexDirection: "row", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12 }}>
        <Surface
          elevation={isUser ? 0 : 1}
          style={{
            width: "100%",
            maxWidth: "80%",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 16,
            backgroundColor: isUser ? theme.colors.primary : theme.colors.elevation.level1 || theme.colors.surface,
            borderBottomRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: isUser ? 16 : 4,
          }}
        >
          <Markdown
            style={{
              body: {
                color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
                fontSize: 15,
                lineHeight: 22,
              },
              code_inline: {
                backgroundColor: isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
                paddingHorizontal: 4,
                borderRadius: 4,
                color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
              },
              fence: {
                backgroundColor: isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
                padding: 8,
                borderRadius: 8,
                color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
              },
              code_block: {
                backgroundColor: isUser ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
                padding: 8,
                borderRadius: 8,
                color: isUser ? theme.colors.onPrimary : theme.colors.onSurface,
              },
              link: {
                color: isUser ? theme.colors.onPrimary : theme.colors.primary,
                textDecorationLine: "underline",
              },
              paragraph: {
                marginVertical: 4,
              },
            }}
          >
            {item.content}
          </Markdown>
        </Surface>
      </View>
    );
  };

  return (
    <AppSafeAreaComponent className="flex-1" style={{ backgroundColor: theme.colors.background }} ignoreBottomOnKeyboardOpened>
      <AppKeyboardAvoidingComponent className="flex-1">
        <AppModalHeader title="Assistente" />

        <View className="flex-1 px-4">
          {messages.length ? (
            <FlatList
              ref={flatListRef}
              data={messages}
              inverted
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id || Math.random().toString()}
              renderItem={renderMessage}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
              ListHeaderComponent={() => {
                if (!sendMessage.isPending) return null;

                return (
                  <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 12 }}>
                    <Surface
                      elevation={1}
                      style={{
                        padding: 12,
                        borderRadius: 16,
                        backgroundColor: theme.colors.elevation.level1 || theme.colors.surface,
                        borderBottomRightRadius: 16,
                        borderBottomLeftRadius: 4,
                        alignItems: "center",
                        justifyContent: "center",
                        width: 64,
                        height: 44,
                      }}
                    >
                      <TypingIndicator />
                    </Surface>
                  </View>
                );
              }}
            />
          ) : (
            <AppKeyboardDismissing.View className="flex-1 justify-center items-center px-8" style={{ backgroundColor: theme.colors.background }}>
              <AppAntonioAvatar size="large" className="mb-4" />

              <Text variant="headlineSmall" style={{ fontWeight: "900", textAlign: "center" }}>
                Olá, eu sou o Antônio!
              </Text>

              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurfaceVariant, textAlign: "center", marginTop: 8, paddingHorizontal: 16 }}
              >
                Como posso te ajudar hoje?
              </Text>
            </AppKeyboardDismissing.View>
          )}
        </View>

        <View
          style={{
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: "transparent",
          }}
        >
          <Surface
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              borderRadius: 28,
              backgroundColor: theme.colors.elevation.level2 || theme.colors.surface,
              paddingLeft: 8,
              paddingRight: 8,
              paddingVertical: 8,
              minHeight: 56,
            }}
          >
            <RNTextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              style={{
                alignSelf: "center",
                flex: 1,
                color: theme.colors.onSurface,
                paddingHorizontal: 12,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: 16,
                maxHeight: 120,
              }}
              multiline
            />

            <View
              style={{
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                icon="send"
                iconColor={inputText.trim() ? theme.colors.primary : theme.colors.onSurfaceDisabled}
                onPress={handleSend}
                disabled={!inputText.trim() || sendMessage.isPending}
                loading={sendMessage.isPending}
                size={20}
                style={{ margin: 0 }}
              />
            </View>
          </Surface>
        </View>
      </AppKeyboardAvoidingComponent>
    </AppSafeAreaComponent>
  );
}
