import { useState } from "react";
import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
export function AppHeader({ searchValue, onSearchChange, searchMails, viewMailBySearch }) {


  return (
    <header className="app-header">
      <section className="container">
        <HomeButton />
        <SearchDropdown searchValue={searchValue} onSearchChange={onSearchChange} searchMails={searchMails} viewMailBySearch={viewMailBySearch} />
      </section>
    </header>
  );
}
