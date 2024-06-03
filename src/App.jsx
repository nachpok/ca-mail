import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MailIndex } from "./cmps/MailIndex";
import { MailDetails } from "./cmps/MailDetails";

export function App() {
  return (
    <Router>
      <section className="main-app">
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/inbox" />} />
            <Route path="*" element={<MailIndex />} />
            <Route path="/:folder" element={<MailIndex />}>
              <Route path=":mailId" element={<MailDetails />} />
            </Route>
          </Routes>
        </main>
      </section>
    </Router>
  );
}
