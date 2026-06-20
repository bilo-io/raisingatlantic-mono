import { useMutation } from "@tanstack/react-query";
import {
  deregisterPushToken,
  registerPushToken,
  type RegisterPushTokenInput,
  type RegisteredPushToken,
} from "../adapters/push-tokens.adapter";

export function usePushTokenRegister() {
  return useMutation<RegisteredPushToken, Error, RegisterPushTokenInput>({
    mutationFn: registerPushToken,
  });
}

export function usePushTokenDeregister() {
  return useMutation<void, Error, string>({
    mutationFn: deregisterPushToken,
  });
}
