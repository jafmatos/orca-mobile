import { FlatList, Keyboard, ScrollView, TouchableWithoutFeedback, View } from "react-native";

function AppKeyboardDismissingView(props: React.ComponentProps<typeof View>) {
  return (
    <TouchableWithoutFeedback className="grow" onPress={() => Keyboard.dismiss()} accessible={false} focusable={false}>
      <View {...props} className={`grow ${props.className}`} />
    </TouchableWithoutFeedback>
  );
}

function AppKeyboardDismissingScrollView(props: React.ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView
      {...props}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[{ flexGrow: 1 }, props.contentContainerStyle]}
    />
  );
}

function AppKeyboardDismissingFlatList<T>(props: React.ComponentProps<typeof FlatList<T>>) {
  return <FlatList {...props} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" />;
}

export const AppKeyboardDismissing = {
  View: AppKeyboardDismissingView,
  ScrollView: AppKeyboardDismissingScrollView,
  FlatList: AppKeyboardDismissingFlatList,
};
