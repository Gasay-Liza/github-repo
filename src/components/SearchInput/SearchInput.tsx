import React from "react";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import styles from "./SearchInput.module.scss";

type SearchInputProps = {
    searchTerm: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };

function SearchInput({searchTerm, handleChange}: SearchInputProps){

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        mr: 1,
        alignItems: "center",
        width: 912,
        height: "42px",
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
    </Paper>
  );
}

export default SearchInput;