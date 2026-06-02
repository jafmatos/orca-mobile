import { PushSubscriptionProvider } from "@/models/PushSubscription";
import { PushSubscriptionService } from "@/services/Api/PushSubscriptionApiService";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function subscribeToPushNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permissão não concedida para notificações Push.");

    return;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Project ID do EAS não encontrado.");

    return;
  }

  const pushTokenString = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  if (pushTokenString) {
    const data = await PushSubscriptionService.create({
      provider: PushSubscriptionProvider.Expo,
      expoPushToken: pushTokenString,
      platform: Platform.OS,
    });

    console.log(data);
  }
}

export async function unsubscribeToPushNotifications() {
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Project ID do EAS não encontrado.");

    return;
  }

  const pushTokenString = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  if (pushTokenString) {
    await PushSubscriptionService.remove({ provider: PushSubscriptionProvider.Expo, expoPushToken: pushTokenString });
  }
}
