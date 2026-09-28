import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/patient/HomePage";
import JoinQueuePage from "./pages/patient/JoinQueuePage";
import ConfirmQueuePage from "./pages/patient/ConfirmQueuePage";
import TicketPage from "./pages/patient/TicketPage";
import TrackQueuePage from "./pages/patient/TrackQueuePage";
import AlmostNextPage from "./pages/patient/AlmostNextPage";
import CalledPage from "./pages/patient/CalledPage";
import CompletePage from "./pages/patient/CompletePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Screen 1: Home / Welcome */}
        <Route path="/" element={<HomePage />} />

        {/* Screen 2: Join a Queue / Select Service */}
        <Route path="/join" element={<JoinQueuePage />} />

        {/* Screen 3: Confirm & Join Queue */}
        <Route path="/confirm" element={<ConfirmQueuePage />} />

        {/* Screen 4: YOU'RE ALL SET! - Ticket Generated */}
        <Route path="/ticket" element={<TicketPage />} />

        {/* Screen 5: Track My Queue */}
        <Route path="/track" element={<TrackQueuePage />} />

        {/* Screen 6: Almost Next */}
        <Route path="/almost-next" element={<AlmostNextPage />} />

        {/* Screen 7: Called */}
        <Route path="/called" element={<CalledPage />} />

        {/* Screen 8: Complete */}
        <Route path="/complete" element={<CompletePage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
