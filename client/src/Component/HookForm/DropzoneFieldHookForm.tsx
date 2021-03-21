import React from "react";
import Dropzone from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CloudUpload from "@material-ui/icons/CloudUpload";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import { FormHelperText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eee",
    textAlign: "center",
    cursor: "pointer",
    color: "#333",
    padding: "10px",
    marginTop: "20px",
  },
  icon: {
    marginTop: "16px",
    color: "#888888",
    fontSize: "42px",
  },
}));

const DropzoneFieldHookForm = ({ name }) => {
  const { control, errors } = useFormContext();
  const styles = useStyles();

  let error = false;
  let error_message = "";

  if (errors && errors?.hasOwnProperty(name)) {
    error = true;
    error_message = errors[name]?.message;
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ onChange, onBlur, value }) => (
        <>
          <Dropzone accept="image/*, video/*" onDrop={onChange}>
            {({ getRootProps, getInputProps }) => (
              <Paper
                variant="outlined"
                className={styles.root}
                {...getRootProps()}
              >
                <CloudUpload className={styles.icon} />
                <input {...getInputProps()} name={name} onBlur={onBlur} />
                <p>Drag and drop files here or click to select files</p>
                <FormHelperText error={error}>{error_message}</FormHelperText>
              </Paper>
            )}
          </Dropzone>

          <List>
            {value.map((f, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <InsertDriveFile />
                </ListItemIcon>
                <ListItemText primary={f.name} secondary={f.size} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    />
  );
};

export default DropzoneFieldHookForm;
