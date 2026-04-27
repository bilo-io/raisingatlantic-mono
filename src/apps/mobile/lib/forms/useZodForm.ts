import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import type { z, ZodType } from "zod";

export function useZodForm<TIn extends FieldValues, TOut extends FieldValues = TIn>(
  schema: ZodType<TOut, TIn> | ZodType<TIn>,
  options?: Omit<UseFormProps<TIn>, "resolver">,
): UseFormReturn<TIn, unknown, TOut> {
  const form = useForm({
    resolver: zodResolver(schema as any),
    mode: "onBlur",
    ...(options as any),
  });
  return form as unknown as UseFormReturn<TIn, unknown, TOut>;
}

export type { z };
