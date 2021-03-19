import { TextField, TextFieldProps } from "@material-ui/core";
import React, { FC, memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface TextFieldHookFormProps {
  textFieldProps: TextFieldProps;
}

export const TextFieldHookForm: FC<TextFieldProps> = memo((props) => {
  const { control, errors } = useFormContext();

  let error = false;
  let error_message = "";

  if (errors && errors?.hasOwnProperty(props?.name)) {
    error = true;
    error_message = errors[props?.name]?.message;
  }

  return (
    <Controller
      name={props.name}
      control={control}
      // defaultValue={""}
      render={(
        { onChange, onBlur, value, name, ref },
        { invalid, isTouched, isDirty }
      ) => (
        <TextField
          {...props}
          name={name}
          error={error}
          defaultValue={value}
          onBlur={onBlur}
          onChange={onChange}
          helperText={error_message}
          inputRef={ref}
        />
      )}
    />
  );
});

export default TextFieldHookForm;
