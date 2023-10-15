import React from "react";
import { Container } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import styles from "./Footer.module.scss";

function Footer() {
  return (
    <StyledEngineProvider injectFirst>
      <Container className={styles.footer} />
    </StyledEngineProvider>
  );
}

export default Footer;
