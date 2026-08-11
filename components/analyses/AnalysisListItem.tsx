import { useAppTheme } from "@/hooks/use-app-theme";
import { Analysis } from "@/models/Analysis";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export interface AnalysisListItemProps extends React.ComponentProps<typeof Pressable> {
  analysis: Analysis;
}

export function AnalysisListItem({ analysis, ...pressableProps }: AnalysisListItemProps) {
  const theme = useAppTheme();

  const issuesCount = analysis.output.issues.length;
  const actionsCount = analysis.output.actions.length;

  return (
    <Pressable {...pressableProps}>
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

        <Text style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }} variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail">
          {analysis.output.diagnostic}
        </Text>

        <View className="flex flex-row items-center gap-3 mt-1">
          {issuesCount > 0 && (
            <View
              className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ backgroundColor: theme.colors.errorContainer }}
            >
              <Icon source="alert-circle-outline" size={14} color={theme.colors.onErrorContainer} />
              <Text style={{ color: theme.colors.onErrorContainer, fontSize: 12, fontWeight: "bold" }}>
                {issuesCount} {issuesCount === 1 ? "alerta" : "alertas"}
              </Text>
            </View>
          )}
          {actionsCount > 0 && (
            <View
              className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ backgroundColor: theme.colors.successContainer }}
            >
              <Icon source="check-circle-outline" size={14} color={theme.colors.onSuccessContainer} />
              <Text style={{ color: theme.colors.onSuccessContainer, fontSize: 12, fontWeight: "bold" }}>
                {actionsCount} {actionsCount === 1 ? "plano" : "planos"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
