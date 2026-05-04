'use client';

import { apiClient, createResourceHooks } from '@/lib/api';

export type Appointment = {
  id: string;
  childId?: string;
  patientId?: string;
  clinicianId?: string;
  startsAt: string;
  endsAt?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const appointmentsResource = createResourceHooks<
  Appointment,
  void,
  Partial<Appointment>,
  Partial<Appointment>
>({
  resource: 'appointments',
  baseUrl: '/appointments',
  client: apiClient,
  copy: {
    create: { success: 'Appointment booked' },
    update: { success: 'Appointment updated' },
    delete: { success: 'Appointment cancelled' },
  },
});

export const {
  keys: appointmentKeys,
  useList: useAppointments,
  useGet: useAppointment,
  useCreate: useCreateAppointment,
  useUpdate: useUpdateAppointment,
  useDelete: useDeleteAppointment,
} = appointmentsResource;
