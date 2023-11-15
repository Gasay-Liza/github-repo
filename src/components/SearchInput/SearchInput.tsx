import React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import styles from "./SearchInput.module.scss";

type SearchInputProps = {
  handleSearch: (event: React.FormEvent<HTMLFormElement>) =>  void;
    searchTerm: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };

function SearchInput({searchTerm, handleChange, handleSearch}: SearchInputProps){

  return (
    <StyledEngineProvider injectFirst>
<Paper
      component="form"
      className={styles.paper}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Запретить стандартную перезагрузку страницы
        handleSearch(event); // Выполнить поиск
      }}
    >
      <InputBase
        className={styles.searchInput}
        sx={{ ml: 2, flex: 1 }}
        placeholder="Введите поисковый запрос"
        inputProps={{ "aria-label": "Введите поисковый запрос" }}
        onChange={handleChange}
        value={searchTerm}
      />
      <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Искать
          </Button>
    </Paper>
    </StyledEngineProvider>
    
  );
}

export default SearchInput;