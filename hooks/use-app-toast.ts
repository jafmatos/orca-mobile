import Toast from "react-native-toast-message";

export type AppToastArguments = {
  title?: string;
  description?: string;
  topOffset?: number;
};

export const useAppToast = () => {
  const success = (props: AppToastArguments) => {
    Toast.show({
      type: "success",
      text1: props.title,
      text2: props.description,
      topOffset: props.topOffset,
    });
  };

  const warning = (props: AppToastArguments) => {
    Toast.show({
      type: "warning",
      text1: props.title,
      text2: props.description,
      topOffset: props.topOffset,
    });
  };

  const error = (props: AppToastArguments) => {
    Toast.show({
      type: "error",
      text1: props.title,
      text2: props.description,
      topOffset: props.topOffset,
    });
  };

  return { success, warning, error };
};
