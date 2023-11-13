import React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./LoadingScreen.module.scss";

function LoadingScreen() {

    return (
        <StyledEngineProvider injectFirst>
            <div
                className={styles.loadingScreen}
            >
                <CircularProgress className={styles.circularProgress} />
            </div>
        </StyledEngineProvider>
    );
}


export default LoadingScreen;