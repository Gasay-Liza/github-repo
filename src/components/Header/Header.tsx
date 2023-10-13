import React from "react";
import { Button, AppBar, Toolbar, Container} from "@mui/material";
// Создаем свою тему
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchInput from "../SearchInput/SearchInput";
// import styles from "./Header.module.scss";


const theme = createTheme({
  palette: {
    secondary: {
      main: "#00838F", // Используемый цвет для AppBar и кнопок
    },
  },
});

function Header () { 
  return ( <ThemeProvider theme={theme}>
      <AppBar color="secondary" position="static">
        <Container maxWidth="lg" sx={{ pt: "19px", pb:"19px"}}>
          <Toolbar variant="dense">
            <SearchInput />
            <Button
              variant="contained"
              color="primary"
              size="large"
            >
              Искать
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;