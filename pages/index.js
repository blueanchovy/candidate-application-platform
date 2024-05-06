import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  styled,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { capitalizeFirstLetterOfEachWord, debounce } from "@/utils/common";
import JobDetailsCard from "@/components/JobDetailsCard";

const inter = Inter({ subsets: ["latin"] });

const StyledTextField = styled(TextField)({
  fontFamily: "Lexend",
  width: "178px",
  marginBottom: "1rem",
  "& .MuiInputBase-root": {
    height: "36px !important",
    fontSize: "13px",
    fontWeight: "500",
  },
  "& .MuiInputBase-input": {
    fontFamily: "Lexend",
    "& .MuiOutlinedInput-input": {
      padding: "5px 8px",
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

export default function Home() {
  const [jobData, setJobData] = useState();
  const [jobsToDisplay, setJobsToDisplay] = useState([]);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const BASE_URL = "https://api.weekday.technology/adhoc/getSampleJdJSON";
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [filters, setFilters] = useState({
    role: [],
    experience: null,
    salary: null,
    location: [],
  });
  const [rolesToDisplay, setRolesToDisplay] = useState([]);
  const [locationsToDisplay, setLocationsToDisplay] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [experienceSearchQuery, setExperienceSearchQuery] = useState("");
  const [salarySearchQuery, setSalarySearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  //set dynamic filter options based on api response
  useEffect(() => {
    if (jobData && jobData.jdList) {
      const uniqueRoles = new Set(
        jobData.jdList.map((job) =>
          capitalizeFirstLetterOfEachWord(job?.jobRole)
        )
      );
      const rolesArray = [...uniqueRoles];
      setRolesToDisplay(rolesArray);
      const uniqueLocations = new Set(
        jobData.jdList.map((job) =>
          capitalizeFirstLetterOfEachWord(job?.location)
        )
      );
      const locationsArray = [...uniqueLocations];
      setLocationsToDisplay(locationsArray);
    }
  }, [jobData]);

  //fetch and set jobs data from api in a state
  const getJobsData = async () => {
    if (!hasMore || loadingMoreData) return;
    setLoadingMoreData(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      limit: 10,
      offset: totalLoaded,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body,
    };

    try {
      const response = await fetch(BASE_URL, requestOptions);
      const result = await response.json();
      setJobData((prevJobData) => ({
        ...prevJobData,
        jdList: (prevJobData?.jdList || []).concat(result.jdList),
      }));
      if (result?.jdList.length > 0) {
        setTotalLoaded((prevTotal) => prevTotal + result.jdList.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingMoreData(false);
    }
  };

  //debounce to prevent multiple fetch calls in a given period
  const debouncedGetJobsData = debounce(getJobsData, 100);

  //fetch jobs data on initial page load
  useEffect(() => {
    if (!jobData) {
      debouncedGetJobsData();
    }
  }, []);

  //determine if the user has reached end of the page, if so fetch more data(Infinite Scroll)
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loadingMoreData &&
      hasMore
    ) {
      debouncedGetJobsData();
    }
  };

  //invoke handleScroll when user scrolls
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMoreData, hasMore]);

  //handle whenever user applies a filter
  const handleFilter = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  //handle search by user
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  //update jobs to be displayed based on user search and filters
  useEffect(() => {
    if (!jobData) return;

    let filteredJobs = [...jobData.jdList];

    filteredJobs = filteredJobs.filter((job) => {
      const { role, experience, salary, location } = filters;
      if (role.length > 0) {
        const match = role.some(
          (selectedRole) =>
            selectedRole.toLowerCase() === job.jobRole.toLowerCase()
        );
        if (!match) {
          return false;
        }
      }
      if (experience !== null && job.minExp > experience) {
        return false;
      }
      if (salary !== null && job.minJdSalary <= salary) {
        return false;
      }
      if (location.length > 0) {
        const match = location.some(
          (selectedLocation) =>
            selectedLocation.toLowerCase() === job.location.toLowerCase()
        );
        if (!match) {
          return false;
        }
      }
      return true;
    });

    if (searchQuery.trim() !== "") {
      filteredJobs = filteredJobs.filter((job) =>
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setJobsToDisplay(filteredJobs);
  }, [jobData, filters, searchQuery]);

  return (
    <>
      <Head>
        <title>Candidate Application Platform</title>
        <meta name="description" content="Weekday - Assignment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
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
              width: "auto",
              "& .MuiInputBase-root": {
                height:
                  filters.role.length > 0
                    ? "auto !important"
                    : "36px !important",
              },
            }}
          />

          <StyledAutoComplete
            value={filters.experience}
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
            options={filtersData.experience}
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
              width: "216px",
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
              width: "auto",
              "& .MuiInputBase-root": {
                height:
                  filters.role.length > 0
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

        <Grid container spacing={5}>
          {jobsToDisplay?.map((job, index) => (
            <JobDetailsCard key={index} job={job} />
          ))}
        </Grid>
        {loadingMoreData && (
          <Box
            sx={{
              display: "flex",
              padding: "1rem",
              color: "blue",
            }}
          >
            <CircularProgress value={loadingMoreData} />
          </Box>
        )}
      </main>
    </>
  );
}
