import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useNobelPrize } from "../../services/noblePrizesService";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

export const SelectComponent = () => {
  const { getUniqueYears, loading } = useNobelPrize();

  const [year, setYear] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    if (!loading) {
      try {
        const years: string[] = getUniqueYears();
        console.log(years);
        setUniqueYears(years);
      } catch (error) {
        throw new Error(
          `Error getting unique years from noblePrizeservice. Status: ${error.status}`
        );
      }
    }
  }, [loading]);

  const handleChange = (event) => {
    const tmp = event.target.value;

    setYear(tmp);
    setButtonDisabled(year === "" || language === "");
  };

  const handleLanguageChange = (event) => {
    const tmp = event.target.value;

    setLanguage(tmp);
    setButtonDisabled(year === "" || tmp === "");
  };

  const handleButtonChange = () => {
    if (year && language) {
      navigate(`/nagrody/${language}/${year}`);
    }
  };

  return (
    <div className="main">
      <h1>Choose this year's Nobel Prize winner:</h1>
      <div className="main">
        <FormControl sx={{ m: 2, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Year</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={year}
            label="Year"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>

          <FormLabel
            id="demo-row-radio-buttons-group-label"
            sx={{ paddingTop: "2rem" }}
          >
            Languge
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={language}
            onChange={handleLanguageChange}
          >
            <FormControlLabel value="en" control={<Radio />} label="en" />
            <FormControlLabel value="no" control={<Radio />} label="no" />
            <FormControlLabel value="se" control={<Radio />} label="se" />
          </RadioGroup>
        </FormControl>
      </div>
      <Button
        className="searchButton"
        variant="contained"
        disabled={isButtonDisabled}
        onClick={handleButtonChange}
      >
        See winners
      </Button>
    </div>
  );
};

export default SelectComponent;
