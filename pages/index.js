import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  styled,
  Autocomplete,
} from "@mui/material";
import Image from "next/image";
import { capitalizeFirstLetterOfEachWord, debounce } from "@/utils/common";

const inter = Inter({ subsets: ["latin"] });

const StyledTextField = styled(TextField)({
  fontFamily: "Lexend",
  width: "178px",
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
        fontFamily: "Lexend", // Apply font family to placeholder
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
    display: "none", // Hide the label
  },
});

const filtersData = {
  roles: [
    "Backend",
    "Frontend",
    "FullStack",
    "IOS",
    "Flutter",
    "React Native",
    "Android",
    "Tech Lead",
    "Dev-Ops",
    "Data Engineer",
    "NLP",
  ],
  experience: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  salary: [0, 10, 20, 30, 40, 50, 60, 70],
  location: ["Remote", "Hybrid"],
};

export default function Home() {
  const [jobData, setJobData] = useState();
  const [jobsToDisplay, setJobsToDisplay] = useState([]);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const BASE_URL = "https://api.weekday.technology/adhoc/getSampleJdJSON";
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [filters, setFilters] = useState({
    role: "",
    experience: null,
    salary: null,
    location: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [experienceSearchQuery, setExperienceSearchQuery] = useState("");

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

  const debouncedGetJobsData = debounce(getJobsData, 100);

  useEffect(() => {
    if (!jobData) {
      debouncedGetJobsData();
    }
  }, []);

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMoreData, hasMore]);

  const handleFilter = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    let filteredJobs = jobData?.jdList;

    if (filteredJobs) {
      filteredJobs = filteredJobs.filter((job) => {
        if (
          filters.role !== "" &&
          !job?.jobRole?.toLowerCase().includes(filters?.role?.toLowerCase())
        ) {
          console.log("hit", filters.role);
          return false;
        }
        if (filters?.experience !== null && job?.minExp > filters?.experience) {
          return false;
        }
        if (filters?.salary !== null && job?.minJdSalary <= filters?.salary) {
          return false;
        }
        if (filters?.location !== "") {
          if (filters?.location === "In-Office") {
            const isRemoteOrHybrid = filtersData?.location?.some(
              (locationType) =>
                job?.location
                  ?.toLowerCase()
                  ?.includes(locationType?.toLowerCase())
            );
            return !isRemoteOrHybrid;
          } else {
            return job?.location
              ?.toLowerCase()
              ?.includes(filters?.location?.toLowerCase());
          }
        }
        return true;
      });

      if (searchQuery.trim() !== "") {
        filteredJobs = filteredJobs.filter((job) =>
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }

    setJobsToDisplay(filteredJobs || []);
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
          <Autocomplete
            value={filters.role}
            onChange={(event, newValue, eventType) => {
              console.log("newValue", newValue);
              if (eventType === "clear") {
                handleFilter({
                  target: { name: "role", value: "" },
                });
                return;
              }
              handleFilter({ target: { name: "role", value: newValue } });
            }}
            inputValue={roleSearchQuery}
            onInputChange={(event, newInputValue) => {
              setRoleSearchQuery(newInputValue);
            }}
            options={filtersData.roles}
            openOnFocus={true}
            clearOnEscape={true}
            // isOptionEqualToValue={(option, value) =>
            //   option === value || value === ""
            // }
            renderInput={(params) => (
              <TextField {...params} label="Roles" placeholder="Search Roles" />
            )}
            sx={{ width: "178px" }}
          />

          <Autocomplete
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
            sx={{ width: "178px" }}
          />

          <FormControl sx={{ width: "200px", margin: "0 0.5rem 0.5rem 0" }}>
            <InputLabel>Minimum Base Pay Salary</InputLabel>
            <Select
              value={filters.salary}
              onChange={handleFilter}
              name="salary"
            >
              {filtersData?.salary.map((band) => (
                <MenuItem key={band} value={band}>
                  {band} L
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: "200px", margin: "0 0.5rem 0.5rem 0" }}>
            <InputLabel>Remote</InputLabel>
            <Select
              value={filters.location}
              onChange={handleFilter}
              name="location"
            >
              {filtersData?.location.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
              <MenuItem value={"In-Office"}>In-Office</MenuItem>
            </Select>
          </FormControl>
          <StyledTextField
            // label="Search Company Name"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Company Name"
          />
        </Box>

        <Grid container spacing={5}>
          {jobsToDisplay?.map((job, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 1px 4px 0px !important",
                  borderRadius: "20px",
                  padding: "1rem 0.4rem 0rem",
                  ":hover": {
                    transform: "scale(1.01)",
                    transition: "ease-in-out",
                    transitionDuration: "200ms",
                  },
                }}
              >
                <CardContent sx={{}}>
                  {/* <Typography variant="subtitle1">{index + 1}</Typography> */}
                  <Box sx={{ display: "flex" }}>
                    <Box sx={{ marginRight: "6px" }}>
                      <Image
                        src={job?.logoUrl}
                        width={28}
                        height={40}
                        alt={`${job.companyName}-logo`}
                      />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Lexend",
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: "1px",
                          marginBottom: "3px",
                          color: "#8b8b8b",
                          ":hover": {
                            cursor: "pointer",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {job.companyName}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: "14px",
                          lineHeight: 1.5,
                          fontFamily: "Lexend",
                          fontWeight: 300,
                        }}
                      >
                        {capitalizeFirstLetterOfEachWord(job.jobRole)}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Lexend",
                          fontSize: "11px",
                          fontWeight: 400,
                          marginTop: "5px",
                          lineHeight: "11px",
                        }}
                      >
                        {capitalizeFirstLetterOfEachWord(job.location)}
                        {(job.minExp || job.maxExp) && (
                          <>
                            {" | Exp: "}
                            {job.minExp ? `${job.minExp}` : ""}
                            {job.minExp && job.maxExp && " - "}
                            {job.maxExp ? `${job.maxExp}` : ""}
                            {" Years"}
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "Lexend",
                      fontSize: "14px !important",
                      fontWeight: 400,
                      margin: "8px 0 !important",
                      color: "#4d596a",
                    }}
                  >
                    Estimated Salary:{" ₹"}
                    {job.minJdSalary && `${job?.minJdSalary} - `}
                    {job.maxJdSalary && `${job?.maxJdSalary}`} LPA ✅
                  </Typography>
                  <Typography
                    sx={{
                      margin: "0px",
                      fontFamily: "Lexend",
                      fontSize: "1rem",
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    About Company:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Lexend",
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    About Us
                  </Typography>

                  <Box sx={{ position: "relative" }}>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography
                        sx={{
                          fontFamily: "Lexend",
                          whiteSpace: "pre-wrap",
                          fontSize: "14px",
                          fontWeight: 300,
                        }}
                      >
                        {job.jobDetailsFromCompany.slice(0, 500)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontFamily: "Lexend",
                        marginTop: "-20px",
                        marginBottom: "0.5rem",
                        textTransform: "none",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        color: "rgb(73, 67, 218)",
                        textDecoration: "none",
                        fontSize: "14px !important",
                        fontWeight: "300 !important",
                        color: "#4943da",
                        ":hover": {
                          border: "none",
                          outline: "none",
                          background: "transparent",
                        },
                      }}
                      disableRipple
                    >
                      View Job
                    </Button>
                  </Box>

                  <Typography
                    sx={{
                      marginTop: "10px",
                      fontFamily: "Lexend",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "1px",
                      marginBottom: "3px",
                      color: "#8b8b8b",
                    }}
                  >
                    Minimum Experience
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: "Lexend",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {job.minExp ? job.minExp + " Years" : "NA"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      backgroundColor: "rgb(85, 239, 196)",
                      color: "rgb(0, 0, 0)",
                      fontFamily: "Lexend",
                      fontWeight: 500,
                      padding: "8px 18px",
                      textTransform: "none",
                      borderRadius: "8px",
                      marginTop: "1rem",
                      marginBottom: "-0.5rem",
                      ":hover": {
                        backgroundColor: "rgb(85, 239, 196)",
                      },
                    }}
                  >
                    ⚡ Easy Apply
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {loadingMoreData && <p>Loading...</p>}
      </main>
    </>
  );
}
