import React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import styles from "./SearchInput.module.scss";

type SearchInputProps = {
    searchTerm: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };

function SearchInput({searchTerm, handleChange}: SearchInputProps){

  return (
    <StyledEngineProvider injectFirst>
<Paper
      component="form"
      className={styles.paper}
    >
      <InputBase
        className={styles.searchInput}
        sx={{ ml: 2, flex: 1 }}
        placeholder="Введите поисковый запрос"
        inputProps={{ "aria-label": "Введите поисковый запрос" }}
        onChange={handleChange}
        value={searchTerm}
      />
    </Paper>
    </StyledEngineProvider>
    
  );
}

export default SearchInput;