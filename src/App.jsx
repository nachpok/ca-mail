import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MailIndex } from "./cmps/MailIndex";
import { MailDetails } from "./cmps/MailDetails";
import { UserMsg } from "./cmps/UserMsg";

export function App() {
  return (
    <Router>
      <section className="main-app">
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/inbox" />} />
            <Route path="*" element={<MailIndex />} />
            <Route path="/search/:searchValue" element={<MailIndex />}>
              <Route path=":mailId" element={<MailDetails />} />
            </Route>
            <Route path="/:folder" element={<MailIndex />}>
              <Route path=":mailId" element={<MailDetails />} />
            </Route>
          </Routes>
          <UserMsg />
        </main>
      </section>
    </Router>
  );
}
