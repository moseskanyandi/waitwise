import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/patient/HomePage";
import JoinQueuePage from "./pages/patient/JoinQueuePage";
import ConfirmQueuePage from "./pages/patient/ConfirmQueuePage";
import TicketPage from "./pages/patient/TicketPage";
import TrackQueuePage from "./pages/patient/TrackQueuePage";
import AlmostNextPage from "./pages/patient/AlmostNextPage";
import CalledPage from "./pages/patient/CalledPage";
import CompletePage from "./pages/patient/CompletePage";
import StaffLoginPage from "./pages/staff/StaffLoginPage";

import {
  DEV_DEMO_PATIENT_STATE,
  DEV_SCREEN_6_PREVIEW,
  DEV_SCREEN_7_PREVIEW,
  DEV_SCREEN_8_PREVIEW,
} from "./constants/devDemoState.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/staff/login" element={<StaffLoginPage />} />

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

        {/* Direct Dev Previews - Accessible only in development (import.meta.env.DEV) */}
        {import.meta.env.DEV && (
          <>
            <Route
              path="/dev/screen-4"
              element={<TicketPage previewState={DEV_DEMO_PATIENT_STATE} />}
            />
            <Route
              path="/dev/screen-5"
              element={<TrackQueuePage previewState={DEV_DEMO_PATIENT_STATE} />}
            />
            <Route
              path="/dev/screen-6"
              element={<AlmostNextPage previewState={DEV_SCREEN_6_PREVIEW} />}
            />
            <Route
              path="/dev/screen-7"
              element={<CalledPage previewState={DEV_SCREEN_7_PREVIEW} />}
            />
            <Route
              path="/dev/screen-8"
              element={<CompletePage previewState={DEV_SCREEN_8_PREVIEW} />}
            />
          </>
        )}

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
