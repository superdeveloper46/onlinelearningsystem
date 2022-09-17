import * as React from "react";
import "./SearchField.scss";
import Icons from "../../assets/icons";
function SearchField({ value, onChange, style }) {
  return (
    <div className="search-field-with-icon" style={style}>
      <span className="icon">
        <Icons.Search></Icons.Search>
      </span>
      <input placeholder="Search.." value={value} onChange={onChange} />
    </div>
  );
}

SearchField.defaultProps = {
  value: "",
  style: {},
  onChange: () => {},
};

export default SearchField;
