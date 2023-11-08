import React from "react";
import { Button, AppBar, Toolbar } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import SearchInput from "../SearchInput/SearchInput";
import styles from "./Header.module.scss";

function Header() {
  return (
    <StyledEngineProvider injectFirst>
      <AppBar color="secondary" position="static" className={styles.header}>
        <Toolbar
          className={styles.headerInner}
          variant="dense"
          sx={{ pl: 0, pr: 0 }}
        >
          <SearchInput />
          <Button variant="contained" color="primary" size="large">
            Искать
          </Button>
        </Toolbar>
      </AppBar>
    </StyledEngineProvider>
  );
}

export default Header;