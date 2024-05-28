import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { MailDetails } from "./cmps/MailDetails";

export function App() {
  return (
    <Router>
      <section className="main-app">
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/inbox" />} />
            <Route path="*" element={<Home />} />
            <Route path="/:folder" element={<Home />}>
              <Route path=":mailId" element={<MailDetails />} />
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  );
}
