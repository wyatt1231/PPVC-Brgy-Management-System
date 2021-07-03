import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Popover,
  Paper,
} from "@material-ui/core";
import React, { memo, FC } from "react";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import styled from "styled-components";
interface IDataTableSearch {
  // onSubmit: (values: any) => void;
  // handleSetSearchField: (value: string) => void;
  // searchField: string;
  FilterComponent?: any;
  width?: number;
}

export const DataTableSearch: FC<IDataTableSearch> = memo(
  ({ FilterComponent, width }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <div>
        {!!FilterComponent && (
          <IconButton type="button" aria-describedby={id} onClick={handleClick}>
            <FilterListRoundedIcon color="primary" />
          </IconButton>
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <PopperContent
            style={{
              minWidth: !!width ? width : 500,
              maxWidth: !!width ? width : 500,
            }}
          >
            <div className="popper-content">
              <div className="title">Filter Records</div>
              <div className="content">{FilterComponent}</div>
            </div>
          </PopperContent>
        </Popover>
      </div>
    );
  }
);

export default DataTableSearch;

const PopperContent = styled(Paper)`
  padding: 1em 0.5em;
  display: grid;
  grid-gap: 0.5em;

  .popper-content {
    padding: 0.5em;

    .title {
      font-weight: 900;
      font-size: 0.83em;
      opacity: 0.6;
    }

    .content {
      padding: 1em;
    }
  }
`;
