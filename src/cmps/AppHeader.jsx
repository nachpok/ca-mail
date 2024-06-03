import { useState } from "react";
import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
export function AppHeader({ viewMailBySearch, fetchMailsByText }) {


  return (
    <header className="app-header">
      <section className="container">
        <HomeButton />
        <SearchDropdown viewMailBySearch={viewMailBySearch} fetchMailsByText={fetchMailsByText} />
      </section>
    </header>
  );
}
