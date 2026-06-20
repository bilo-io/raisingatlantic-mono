import * as Notifications from "expo-notifications";
import { warnIfPushPayloadHasPII } from "./scrub";

let configured = false;

export function configureNotificationHandler(): void {
  if (configured) return;
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const content = notification.request.content;
      warnIfPushPayloadHasPII({
        title: content.title,
        body: content.body,
        subtitle: content.subtitle ?? null,
      });
      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
      };
    },
  });
  configured = true;
}
