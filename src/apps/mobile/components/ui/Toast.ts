import * as Haptics from "expo-haptics";
import { toast as sonnerToast } from "sonner-native";

type Options = { description?: string };

export const toast = {
  success(title: string, opts?: Options) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    sonnerToast.success(title, { description: opts?.description });
  },
  error(title: string, opts?: Options) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    sonnerToast.error(title, { description: opts?.description });
  },
  info(title: string, opts?: Options) {
    sonnerToast(title, { description: opts?.description });
  },
};
