import { useAppTheme } from "@/hooks/use-app-theme";
import { Analysis } from "@/models/Analysis";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";

export interface AnalysisListItemProps extends React.ComponentProps<typeof Pressable> {
  analysis: Analysis;
}

export function AnalysisListItem({ analysis, ...pressableProps }: AnalysisListItemProps) {
  const theme = useAppTheme();

  const issuesCount = analysis.output.issues.length;
  const actionsCount = analysis.output.actions.length;

  return (
    <Pressable {...pressableProps}>
      <Surface style={{ borderRadius: theme.roundness, overflow: "hidden", elevation: 1 }}>
        <View className="p-4 flex flex-col gap-3">
          <View className="flex flex-row items-center justify-between gap-4">
            <View style={{ flexShrink: 1 }} className="flex flex-row items-center">
              <Text className="grow" style={{ fontWeight: "bold", fontSize: 16 }} variant="titleMedium">
                Análise do Antônio
              </Text>

              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {new Date(analysis.createdAt).getFullYear() === new Date().getFullYear()
                  ? new Date(analysis.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })
                  : new Date(analysis.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
              </Text>
            </View>
          </View>

          <Text
            style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}
            variant="bodyMedium"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {analysis.output.diagnostic}
          </Text>

          <View className="flex flex-row items-center gap-3 mt-1">
            {issuesCount > 0 && (
              <View className="flex flex-row items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-md">
                <Icon source="alert-circle-outline" size={14} color={theme.colors.error} />
                <Text style={{ color: theme.colors.error, fontSize: 12, fontWeight: "bold" }}>
                  {issuesCount} {issuesCount === 1 ? "alerta" : "alertas"}
                </Text>
              </View>
            )}
            {actionsCount > 0 && (
              <View className="flex flex-row items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                <Icon source="check-circle-outline" size={14} color={theme.colors.success} />
                <Text style={{ color: theme.colors.success, fontSize: 12, fontWeight: "bold" }}>
                  {actionsCount} {actionsCount === 1 ? "plano" : "planos"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}
