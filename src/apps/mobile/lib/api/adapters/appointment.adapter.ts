import type { Appointment } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { appointmentsFixture } from "../fixtures/appointments";

export type AppointmentListParams = {
  childId?: string;
  clinicianId?: string;
  practiceId?: string;
  from?: string;
  to?: string;
};

export async function getAppointments(params?: AppointmentListParams): Promise<Appointment[]> {
  if (useApi()) {
    const res = await api.get<Appointment[]>("/appointments", { params });
    return res.data;
  }
  let list = appointmentsFixture;
  if (params?.childId) list = list.filter((a) => a.childId === params.childId);
  if (params?.clinicianId) list = list.filter((a) => a.clinicianId === params.clinicianId);
  if (params?.practiceId) list = list.filter((a) => a.practiceId === params.practiceId);
  return list;
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  if (useApi()) {
    const res = await api.get<Appointment>(`/appointments/${id}`);
    return res.data;
  }
  const match = appointmentsFixture.find((a) => a.id === id);
  if (!match) throw new Error(`Appointment ${id} not found`);
  return match;
}
