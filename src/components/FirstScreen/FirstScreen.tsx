import React from "react";
import { StyledEngineProvider } from "@mui/material/styles";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./FirstScreen.module.scss";

interface Props {
  text: string;
}

function FirstScreen({ text }: Props) {
  return (
    <StyledEngineProvider injectFirst>
      <Container className={styles.wrapper}>
        <Typography className={styles.title} variant="h3">
          {text}
        </Typography>
      </Container>
    </StyledEngineProvider>
  );
}

export default FirstScreen;
