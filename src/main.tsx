import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WinnersComponent from "./components/winnersComponent/WinnersComponent.tsx";
import { NobelPrizeProvider } from "./services/noblePrizesService.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NobelPrizeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/nagrody/:language/:year"
            element={<WinnersComponent />}
          />
        </Routes>
      </BrowserRouter>
    </NobelPrizeProvider>
  </React.StrictMode>
);
