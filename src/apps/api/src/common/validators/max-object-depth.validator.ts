import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface DepthOptions {
  maxDepth: number;
  maxKeys: number;
}

const DEFAULTS: DepthOptions = { maxDepth: 4, maxKeys: 200 };

function measure(
  value: unknown,
  remainingDepth: number,
  budget: { keys: number },
): boolean {
  if (value === null || typeof value !== 'object') return true;
  if (remainingDepth < 0) return false;

  if (Array.isArray(value)) {
    for (const item of value) {
      budget.keys -= 1;
      if (budget.keys < 0) return false;
      if (!measure(item, remainingDepth - 1, budget)) return false;
    }
    return true;
  }

  for (const key of Object.keys(value)) {
    budget.keys -= 1;
    if (budget.keys < 0) return false;
    if (
      !measure(
        (value as Record<string, unknown>)[key],
        remainingDepth - 1,
        budget,
      )
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Caps the nesting depth and total key count of a free-form JSON field.
 * Used on report.content to prevent stack-blowing or memory-blowing payloads
 * (an attacker-supplied 100-level-nested object will hang JSON.stringify).
 */
@ValidatorConstraint({ name: 'MaxObjectDepth', async: false })
export class MaxObjectDepth implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [maxDepth = DEFAULTS.maxDepth, maxKeys = DEFAULTS.maxKeys] =
      (args.constraints ?? []) as [number?, number?];
    if (value === undefined || value === null) return true;
    return measure(value, maxDepth, { keys: maxKeys });
  }

  defaultMessage(args: ValidationArguments): string {
    const [maxDepth = DEFAULTS.maxDepth, maxKeys = DEFAULTS.maxKeys] =
      (args.constraints ?? []) as [number?, number?];
    return `${args.property} exceeds the allowed structure (max depth ${maxDepth}, max keys ${maxKeys})`;
  }
}
