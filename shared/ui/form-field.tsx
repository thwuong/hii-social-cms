import { Control, Controller } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { Input } from './input';

type FormFieldProps = {
  name: string;
  control: Control<any> | undefined;
  label?: string;
  description?: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  required?: boolean;
};
function FormField({
  name,
  control,
  label,
  description,
  placeholder,
  autoComplete,
  type,
  required,
}: FormFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel htmlFor={field.name}>
              {label} {required && <span className="text-red-500">*</span>}
            </FieldLabel>
          )}
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete={autoComplete}
            type={type}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default FormField;
