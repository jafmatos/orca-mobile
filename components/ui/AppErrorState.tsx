import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
export interface AppErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function AppErrorState({ message, onRetry }: AppErrorStateProps) {
  const theme = useTheme();

  return (
    <View className="flex flex-col justify-center items-center gap-6 flex-1">
      <View className="flex flex-col items-center gap-2">
        <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.onBackground }}>
          Ops, algo deu errado!
        </Text>
        <Text variant="bodyMedium" className="!text-center" style={{ color: theme.colors.outline }}>
          {message || "Houve um erro inesperado ao carregar os dados. Verifique sua conexão e tente novamente."}
        </Text>
      </View>
      
      {onRetry && (
        <Button mode="contained" onPress={onRetry} buttonColor={theme.colors.error} textColor={theme.colors.onError} style={{ marginTop: 8 }}>
          Tentar novamente
        </Button>
      )}
    </View>
  );
}
