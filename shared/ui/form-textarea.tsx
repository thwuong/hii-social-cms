import { Control, Controller } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { Textarea } from './textarea';

type FormTextareaProps = {
  name: string;
  control: Control<any> | undefined;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
};

function FormTextarea({
  name,
  control,
  label,
  description,
  placeholder,
  required,
  className,
  rows,
}: FormTextareaProps) {
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
          <Textarea
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className={className}
            rows={rows}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default FormTextarea;
