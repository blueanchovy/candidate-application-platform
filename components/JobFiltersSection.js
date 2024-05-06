import styled from "@emotion/styled";
import { Autocomplete, Box, TextField } from "@mui/material";
import React from "react";

const StyledTextField = styled(TextField)({
  fontFamily: "Lexend",
  width: "196px",
  marginBottom: "1rem",
  "& .MuiInputBase-root": {
    height: "36px !important",
    fontSize: "13px",
    fontWeight: "500",
  },
  "& .MuiInputBase-input": {
    fontFamily: "Lexend",
    "& .MuiOutlinedInput-input": {
      padding: "5px 8px !important",
      fontFamily: "Lexend",
      "&::placeholder": {
        fontFamily: "Lexend",
      },
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#cccccc",
      borderRadius: "4px",
    },
    "&:hover fieldset": {
      borderColor: "#cccccc",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #cccccc",
      borderColor: "#cccccc",
    },
  },
  "& .MuiInputLabel-root": {
    display: "none",
  },
});
const StyledAutoComplete = styled(Autocomplete)({
  fontFamily: "Lexend",
  width: "178px",
  marginBottom: "1rem",
  marginRight: "16px",

  "& .MuiInputBase-root": {
    fontSize: "13px",
    fontWeight: "500",
  },
  "& .MuiInputBase-input": {
    fontFamily: "Lexend",
    marginTop: "-8px",
    "& .MuiOutlinedInput-input": {
      // marginTop: "-8px",
      padding: "0 8px",
      fontFamily: "Lexend",
      "&::placeholder": {
        fontFamily: "Lexend",
      },
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#cccccc",
      borderRadius: "4px",
    },
    "&:hover fieldset": {
      borderColor: "#cccccc",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #cccccc",
      borderColor: "#cccccc",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Lexend",
    fontSize: "13px",
    marginTop: "-8px",
  },
  // "& .MuiButtonBase-root": {
  "& .MuiChip-root": {
    fontSize: "12px",
    margin: "0 3px !important",
    height: "16px !important",
    fontFamily: "Lexend",
    // },
  },
  "& .MuiChip-deleteIcon": {
    fontSize: "14px !important",
  },
});

const filtersData = {
  // roles: [
  //   "Backend",
  //   "Frontend",
  //   "FullStack",
  //   "IOS",
  //   "Flutter",
  //   "React Native",
  //   "Android",
  //   "Tech Lead",
  //   "Dev-Ops",
  //   "Data Engineer",
  //   "NLP",
  // ],
  experience: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  salary: [0, 10, 20, 30, 40, 50, 60, 70],
  // location: ["Remote", "Hybrid", "In-office"],
};

function JobFiltersSection({
  handleSearch,
  handleFilter,
  searchQuery,
  roleSearchQuery,
  setRoleSearchQuery,
  experienceSearchQuery,
  setExperienceSearchQuery,
  salarySearchQuery,
  setSalarySearchQuery,
  locationSearchQuery,
  setLocationSearchQuery,
  rolesToDisplay,
  locationsToDisplay,
  filters,
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          margin: "0 auto 1rem auto",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <StyledAutoComplete
          value={filters.role}
          multiple
          onChange={(event, newValue, eventType) => {
            if (eventType === "clear") {
              handleFilter({ target: { name: "role", value: [] } });
            } else {
              handleFilter({ target: { name: "role", value: newValue } });
            }
          }}
          inputValue={roleSearchQuery}
          onInputChange={(event, newInputValue) => {
            setRoleSearchQuery(newInputValue);
          }}
          options={rolesToDisplay?.filter(
            (roleType) => !filters.role.includes(roleType)
          )}
          openOnFocus={true}
          clearOnEscape={true}
          renderInput={(params) => (
            <TextField {...params} label="Roles" placeholder="Search Roles" />
          )}
          sx={{
            minWidth: "178px",
            width: "auto !important",
            "& .MuiInputBase-root": {
              height:
                filters.role.length > 0 ? "auto !important" : "36px !important",
            },
          }}
        />

        <StyledAutoComplete
          value={filters?.experience}
          onChange={(event, newValue, eventType) => {
            if (eventType === "clear") {
              handleFilter({
                target: { name: "experience", value: null },
              });
              return;
            }
            handleFilter({ target: { name: "experience", value: newValue } });
          }}
          inputValue={experienceSearchQuery}
          onInputChange={(event, newInputValue) => {
            setExperienceSearchQuery(newInputValue);
          }}
          options={filtersData?.experience}
          openOnFocus={true}
          clearOnEscape={true}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Experience"
              placeholder="Experience"
            />
          )}
          sx={{
            width: "178px",
            "& .MuiInputBase-root": {
              height: "36px !important",
            },
          }}
        />
        <StyledAutoComplete
          value={filters.salary}
          onChange={(event, newValue, eventType) => {
            if (eventType === "clear") {
              handleFilter({
                target: { name: "salary", value: null },
              });
              return;
            }
            handleFilter({ target: { name: "salary", value: newValue } });
          }}
          inputValue={salarySearchQuery}
          onInputChange={(event, newInputValue) => {
            setSalarySearchQuery(newInputValue);
          }}
          options={filtersData.salary}
          openOnFocus={true}
          clearOnEscape={true}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Minimum Base Pay Salary"
              placeholder="Minimum Base Pay Salary"
            />
          )}
          sx={{
            width: "216px !important",
            "& .MuiInputBase-root": {
              height: "36px !important",
            },
          }}
        />

        <StyledAutoComplete
          value={filters.location}
          multiple
          onChange={(event, newValue, eventType) => {
            if (eventType === "clear") {
              handleFilter({ target: { name: "location", value: [] } });
            } else {
              handleFilter({ target: { name: "location", value: newValue } });
            }
          }}
          inputValue={locationSearchQuery}
          onInputChange={(event, newInputValue) => {
            setLocationSearchQuery(newInputValue);
          }}
          options={locationsToDisplay?.filter(
            (locationName) => !filters.location.includes(locationName)
          )}
          openOnFocus={true}
          clearOnEscape={true}
          renderInput={(params) => (
            <TextField {...params} label="Location" placeholder="Location" />
          )}
          sx={{
            minWidth: "178px",
            width: "auto !important",
            "& .MuiInputBase-root": {
              height:
                filters.location.length > 0
                  ? "auto !important"
                  : "36px !important",
            },
          }}
        />

        <StyledTextField
          // label="Search Company Name"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Company Name"
        />
      </Box>
    </>
  );
}

export default JobFiltersSection;
