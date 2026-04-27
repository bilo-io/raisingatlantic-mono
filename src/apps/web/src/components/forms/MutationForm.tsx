'use client';

import {
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ZodTypeAny, z } from 'zod';
import { Form } from '@/components/ui/form';
import type { ApiError } from '@/lib/api';
import type { ReactNode } from 'react';
import { isAxiosFieldErrorPayload, applyServerFieldErrors } from './field-errors';

type MutationFormProps<TSchema extends ZodTypeAny, TResult> = {
  schema: TSchema;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  mutation: UseMutationResult<TResult, ApiError, z.infer<TSchema>>;
  onSuccess?: (result: TResult) => void;
  /** Render the form body. Receives the form instance so callers can wire
   *  `<FormField control={form.control} ...>`. */
  children: (form: UseFormReturn<z.infer<TSchema>>) => ReactNode;
  /** Extra props forwarded to the underlying <form> element. */
  className?: string;
};

/**
 * Wraps react-hook-form + zodResolver + a TanStack mutation. The caller
 * supplies the schema, defaults, and the mutation hook; this component
 * handles submit wiring, server-side field-error mapping, and success
 * forwarding. Toast on error is handled by the resource hook layer.
 */
export function MutationForm<TSchema extends ZodTypeAny, TResult>({
  schema,
  defaultValues,
  mutation,
  onSuccess,
  children,
  className,
}: MutationFormProps<TSchema, TResult>) {
  type FormShape = z.infer<TSchema> & FieldValues;

  const form = useForm<FormShape>({
    // zod v3 resolver is compatible; cast keeps TS happy across schema generic.
    resolver: zodResolver(schema as never) as never,
    defaultValues,
  });

  const submit: SubmitHandler<FormShape> = async (values) => {
    try {
      const result = await mutation.mutateAsync(values as z.infer<TSchema>);
      onSuccess?.(result);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.data && isAxiosFieldErrorPayload(apiErr.data)) {
        applyServerFieldErrors(form, apiErr.data);
      }
      // The resource hook already surfaced a toast; nothing else to do here.
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className={className} noValidate>
        {children(form as UseFormReturn<z.infer<TSchema>>)}
      </form>
    </Form>
  );
}
