import Toast from "react-native-toast-message";

export type AppToastArguments = {
  title?: string;
  description?: string;
};

export const useAppToast = () => {
  const success = (props: AppToastArguments) => {
    Toast.show({
      type: "success",
      text1: props.title,
      text2: props.description,
    });
  };

  const warning = (props: AppToastArguments) => {
    Toast.show({
      type: "warning",
      text1: props.title,
      text2: props.description,
    });
  };

  const error = (props: AppToastArguments) => {
    Toast.show({
      type: "error",
      text1: props.title,
      text2: props.description,
    });
  };

  return { success, warning, error };
};
