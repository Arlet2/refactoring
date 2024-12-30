import React from "react";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Transports from "./pages/Transports";
import NoPageFound from "./pages/NoPageFound";
import Deliveries from "./pages/Deliveries";
import Factories from "./pages/Factories";
import DeliveryPoints from "./pages/DeliveryPoints";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/transports" element={<Transports />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/factories" element={<Factories />} />
          <Route path="/delivery_points" element={<DeliveryPoints />} />
        </Route>
        <Route path="*" element={<NoPageFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
