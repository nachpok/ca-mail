import { HomeButton } from "./HomeButton";
import { SearchDropdown } from "./SearchDropdown";
export function AppHeader({ fetchMailsByText, fetchMailsByAdvancedSearch }) {


  return (
    <header className="app-header">
      <HomeButton />
      <SearchDropdown fetchMailsByText={fetchMailsByText} fetchMailsByAdvancedSearch={fetchMailsByAdvancedSearch} />

    </header>
  );
}
