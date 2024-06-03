import { useState } from "react";
import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
export function AppHeader({ fetchMailsByText }) {


  return (
    <header className="app-header">
      <section className="container">
        <HomeButton />
        <SearchDropdown fetchMailsByText={fetchMailsByText} />
      </section>
    </header>
  );
}
