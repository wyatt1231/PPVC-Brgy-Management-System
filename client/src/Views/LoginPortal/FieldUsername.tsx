import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { useField } from "formik";
import React, { memo, FC } from "react";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
interface IFieldUsername {}

export const FieldUsername: FC<IFieldUsername> = memo(() => {
  const [field] = useField({ name: "email" });
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="outlined-adornment-amount">Email Address</InputLabel>
      <OutlinedInput
        style={{ borderRadius: `25px` }}
        id="outlined-adornment-amount"
        startAdornment={
          <InputAdornment position="start">
            <PersonRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        labelWidth={110}
        {...field}
        autoFocus={true}
      />
    </FormControl>
  );
});

export default FieldUsername;
