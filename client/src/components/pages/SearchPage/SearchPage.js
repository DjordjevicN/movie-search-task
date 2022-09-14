import React, { useState, useEffect, useCallback, useContext } from "react";
import "./SearchPage.scss";
import TextInput from "../../atoms/TextInput/TextInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("movie");
  const [yearFilter, setYearFilter] = useState("");
  const [movies, setMovies] = useState();
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isLoggedIn) {
      navigate("/login");
    }
  }, [navigate, state.isLoggedIn]);

  const handleSearch = useCallback(async () => {
    const title = searchValue.replace(/\s+/g, "+").toLowerCase();
    const data = {
      typeFilter,
      yearFilter,
      title,
    };

    const response = await axios.post(`http://localhost:5000/search`, {
      data,
    });
    response.data.Response && setMovies(response.data);
  }, [searchValue, typeFilter, yearFilter]);

  useEffect(() => {
    if (searchValue.length > 2) {
      handleSearch();
    }
  }, [searchValue, handleSearch]);

  const populateYearOptions = () => {
    let yearArray = [];
    for (let i = 2022; i > 1824; i--) {
      yearArray.push(i);
    }
    return yearArray;
  };

  return (
    <div className="searchPage">
      <div className="searchPage__content">
        <div className="searchBar">
          <div className="searchBar__content">
            <img src="/images/logo.png" alt="logo" className="logo" />
            <div className="actions">
              <select onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
              <select onChange={(e) => setYearFilter(e.target.value)}>
                <option value="">Year</option>
                {populateYearOptions().map((item) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
              <TextInput
                placeholder="Search"
                onChange={(inputValue) => setSearchValue(inputValue)}
              />
            </div>
          </div>
        </div>
        <div className="displayResults">
          {movies && searchValue.length > 1 && (
            <div className="singleMovie">
              <div className="singleMovie__content">
                <img
                  src={
                    movies.Poster !== "N/A"
                      ? movies.Poster
                      : "/images/noimage.png"
                  }
                  alt={movies.Title}
                />
                <h1>{movies?.Title}</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
