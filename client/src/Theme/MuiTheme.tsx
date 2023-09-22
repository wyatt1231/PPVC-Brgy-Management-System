import { Color } from "@material-ui/core";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from "@material-ui/core/styles";

interface ThemeProp {
  appbar: IAppBar;
}

interface IAppBar {
  bgColor: string;
  color: string;
  height: number;
}

interface IBodyStyles {
  backgroundColor: string;
}

export interface StyledComponentTheme {
  theme: Theme;
}

declare module "@material-ui/core/styles/createMuiTheme" {
  interface ThemeOptions {
    header?: IHeader;
    sidebar?: ISidebar;
    body?: IBodyStyles;
  }

  interface IHeader {
    height: number;
    backgroundColor: string;
    color: string;
    fontFamily: string;
  }

  interface ISidebar {
    maxWidth: number;
    minWidth: number;
    backgroundColor: string;
    color: string;
  }
}

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    blue: Color;
    bg: Color;
    // gray: Palette["primary"];
    // grey: Palette["primary"],
    // orange: Palette["primary"],
    // red: Palette["primary"]
  }

  interface PaletteOptions {
    blue?: PaletteOptions["primary"];
    // bg: PaletteOptions["primary"];
    // gray?: PaletteOptions["primary"];
  }
}

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff5959",
    },
    secondary: {
      main: "#facf5a",
    },
  },
  typography: {
    button: {
      textTransform: "unset",
      fontFamily: "Nunito",
    },
    fontFamily: [
      "Nunito",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  header: {
    backgroundColor: "#fff",
    height: 65,
    color: "black",
    fontFamily: "Nunito",
  },
  sidebar: {
    maxWidth: 270,
    minWidth: 65,
    backgroundColor: "#492540",
    color: "#fff",
  },
  body: {
    backgroundColor: " #edfcff",
  },
});

theme = responsiveFontSizes(theme);
export default theme;
