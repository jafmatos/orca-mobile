import { Entry, EntryTypes } from "@/models/Entry";
import { Box, Text } from "@gluestack-ui/themed";
import { currencyFormatter } from "@/utils/currencyFormatter";

export type EntryCardProps = {
  entry: Entry;
};

export function EntryCard(props: EntryCardProps) {
  const signedAmount = props.entry.type === EntryTypes.Income ? props.entry.amount : props.entry.amount;
  const formattedAmount = currencyFormatter.format(signedAmount);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(props.entry.when));
  const categoryName = props.entry.category?.name || "Sem categoria";
  const description = props.entry.description || "Sem descrição";
  const amountTextColor = props.entry.type === EntryTypes.Income ? "$success500" : "$danger500";

  return (
    <Box className="p-4 rounded-lg flex flex-col gap-2" backgroundColor="$background800">
      <Box className="flex flex-row justify-between items-center">
        <Text fontSize={16} fontWeight={600} color="$typography0">
          {categoryName}
        </Text>
        <Text fontSize={14} fontWeight={500} color={amountTextColor}>
          {formattedAmount}
        </Text>
      </Box>
      <Box className="flex flex-row justify-between items-center gap-4">
        <Text fontSize={16} fontWeight={400} color="$typography400" ellipsizeMode="tail" numberOfLines={1} flex={1}>
          {description}
        </Text>
        <Text fontSize={13} fontWeight={500} color="$typography400">
          {formattedDate}
        </Text>
      </Box>
    </Box>
  );
}
