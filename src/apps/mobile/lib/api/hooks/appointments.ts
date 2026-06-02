import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@raising-atlantic/types";
import { api } from "../client";
import { createResourceHooks } from "../createResourceHooks";

export const appointmentsResource = createResourceHooks<
  Appointment,
  void,
  CreateAppointmentInput,
  UpdateAppointmentInput
>({
  resource: "appointments",
  baseUrl: "/appointments",
  client: api,
  copy: {
    create: { success: "Appointment scheduled" },
    update: { success: "Appointment updated" },
    delete: { success: "Appointment cancelled" },
  },
});

export const {
  keys: appointmentKeys,
  useList: useAppointments,
  useGet: useAppointment,
  useCreate: useCreateAppointment,
  useUpdate: useUpdateAppointment,
  useDelete: useCancelAppointment,
} = appointmentsResource;
