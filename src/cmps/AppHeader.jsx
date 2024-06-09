import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
export function AppHeader({ fetchMailsByText, fetchMailsByAdvancedSearch }) {


  return (
    <header className="app-header">
      <section className="container">
        <HomeButton />
        <SearchDropdown fetchMailsByText={fetchMailsByText} fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch} />
      </section>
    </header>
  );
}
