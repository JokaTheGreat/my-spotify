import { ReactComponent as PrevPageIcon } from "../../assets/imgs/icons/prev-page-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/imgs/icons/search-icon-2.svg";
import { ReactComponent as ClearIcon } from "../../assets/imgs/icons/clear-icon.svg";
import { ReactComponent as AccountIcon } from "../../assets/imgs/icons/account-icon.svg";
import { ReactComponent as ShowMoreIcon } from "../../assets/imgs/icons/show-more-icon.svg";
import "./SearchHeader.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../utils/paths";

export function SearchHeader() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [clearButtonVisible, setClearButtonVisible] = useState(false);

  useEffect(() => {
    if (searchValue !== "") {
      setClearButtonVisible(true);
    } else {
      setClearButtonVisible(false);
    }
  }, [searchValue]);

  const redirectToSearchPage = () => {
    if (searchValue !== "") {
      navigate(paths.search(searchValue));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      redirectToSearchPage();
    }
  };

  return (
    <header className="header header_sticky">
      <div className="page-pointers">
        <PrevPageIcon className="page-pointers__arrow page-pointers__arrow_active" />
        <PrevPageIcon className="page-pointers__arrow page-pointers__arrow_right" />
      </div>

      <div className="search-form">
        <button className="search-form__button">
          <SearchIcon
            onClick={redirectToSearchPage}
            className="search-form__search-icon"
          />
        </button>
        <input
          type="text"
          placeholder="Исполнитель, трек или подкаст"
          className="search-form__input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <ClearIcon
          className={
            clearButtonVisible
              ? "search-form__clear-icon search-form__clear-icon_active"
              : "search-form__clear-icon"
          }
          onClick={() => setSearchValue("")}
        />
      </div>

      <div className="account account_margin-left-auto">
        <div className="account__icon-container">
          <AccountIcon className="account__icon" />
        </div>
        <span className="account__name">Никита</span>
        <div className="account__arrow-container">
          <ShowMoreIcon className="account__arrow" />
        </div>
      </div>
    </header>
  );
}
