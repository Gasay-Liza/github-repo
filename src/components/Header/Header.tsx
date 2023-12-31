import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppBar, Toolbar } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { repositoriesSlice } from "../../app/repositoriesSlice";

import { AppDispatch } from "../../app/store";
import SearchInput from "../SearchInput/SearchInput";
import styles from "./Header.module.scss";

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { setIsSearchActive } = repositoriesSlice.actions;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(repositoriesSlice.actions.setSearchTerm(searchTerm));
    dispatch(setIsSearchActive(true));
  };

  return (
    <StyledEngineProvider injectFirst>
      <AppBar color="secondary" position="static" className={styles.header}>
        <Toolbar
          className={styles.headerInner}
          variant="dense"
          sx={{ pl: 0, pr: 0 }}
        >
          <SearchInput
            searchTerm={searchTerm}
            handleChange={handleChange}
            handleSearch={handleSearch}
          />
        </Toolbar>
      </AppBar>
    </StyledEngineProvider>
  );
}

export default Header;
