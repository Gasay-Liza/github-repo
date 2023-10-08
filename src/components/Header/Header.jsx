import React from "react";
import { Button, AppBar, Toolbar, Container} from "@mui/material";
import SearchInput from "../SearchInput/SearchInput";

// Создаем свою тему
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    secondary: {
      main: "#00838F", // Используемый цвет для AppBar и кнопок
    },
  },
});

function Header() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" color="secondary">
        <Container maxWidth="lg" sx={{ pt: "19px", pb:"19px"}}>
          <Toolbar variant="dense">
            <SearchInput />
            <Button
              variant="contained"
              color="primary"
              size="large"
              elevation={2}
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
