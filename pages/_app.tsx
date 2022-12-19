import { Container } from "@mui/material";
import i18n from "i18next";
import type { AppProps } from "next/app";
import { initReactI18next } from "react-i18next";

import { GardianAppBar } from "../components/app-bar";
import "../styles/globals.css";
import { translations } from "../translations";

i18n.use(initReactI18next).init({
  resources: translations,
  lng: "en",
  fallbackLng: "en",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container style={{ paddingTop: "64px" }} maxWidth="xl">
      <GardianAppBar />
      <Component {...pageProps} />
    </Container>
  );
}
