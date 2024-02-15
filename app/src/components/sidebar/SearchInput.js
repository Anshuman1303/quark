import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./SearchInput.css";

const SearchBar = ({ setSearchFriends }) => {
  return (
    <div className="search-wrap">
      <label htmlFor="searchChats">
        <MagnifyingGlass />
      </label>
      <input
        type="text"
        name="search"
        id="searchChats"
        className="search"
        placeholder="Search"
        autoComplete="off"
        onChange={(e) => setSearchFriends(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
