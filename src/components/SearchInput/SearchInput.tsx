import React, {useState} from "react";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import styles from "./SearchInput.module.scss";


function SearchInput() {
  const [input, setInput] = useState("");
  // const handleSearchClick = (event : React.MouseEvent<HTMLButtonElement> | null) => {
  //   event.preventDefault();
  //   // Выполняется действие поиска, обновляя состояние Redux, чтобы отобразить результаты поиска
  //   dispatch(searchTerm(input));
  // }

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
        onChange={(e) => {setInput(e.target.value)}}
        value={input}
      />
    </Paper>
  );
}

export default SearchInput;

