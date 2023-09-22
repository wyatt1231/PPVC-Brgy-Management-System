import DateFnsUtils from "@date-io/date-fns";
import { Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import moment from "moment";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface DateFieldHookFormProps extends Partial<KeyboardDatePickerProps> {
  name: string;
  onChange?: any;
  type: "date" | "datetime" | "time";
}

const DateFieldHookForm: React.FC<DateFieldHookFormProps> = React.memo(
  (props) => {
    const { control, errors } = useFormContext();

    let error = false;
    let error_message = "";

    if (errors && errors?.hasOwnProperty(props?.name)) {
      error = true;
      error_message = errors[props?.name]?.message;
    }

    return (
      <Controller
        control={control}
        name={props.name}
        defaultValue={props.defaultValue}
        render={({ onChange, onBlur, value }) => {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                {props.type === "datetime" && (
                  <KeyboardDateTimePicker
                    name={props.name}
                    label={props.label}
                    fullWidth={props.fullWidth}
                    disableFuture={props.disableFuture}
                    disablePast={props.disablePast}
                    clearable={props.clearable}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    defaultValue={props.defaultValue}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    format="yyyy/MM/dd hh:mm a"
                    autoOk={true}
                    error={error}
                    helperText={error_message}
                  />
                )}

                {props.type === "date" && (
                  <KeyboardDatePicker
                    name={props.name}
                    label={props.label}
                    fullWidth={props.fullWidth}
                    disableFuture={props.disableFuture}
                    disablePast={props.disablePast}
                    clearable={props.clearable}
                    InputLabelProps={props.InputLabelProps}
                    inputVariant={props.inputVariant}
                    // defaultValue={props.defaultValue}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    // value={value ? moment(value).format() : ""}
                    format="MM/dd/yyyy"
                    autoOk={props.autoOk}
                    error={error}
                    helperText={error_message}
                    placeholder="MM/DD/YYYY"
                  />
                )}
              </Grid>
            </MuiPickersUtilsProvider>
          );
        }}
      />
    );
  }
);

export default DateFieldHookForm;
