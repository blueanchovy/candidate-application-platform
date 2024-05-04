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
} from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

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

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn.apply(null, args);
      }, delay);
    };
  };

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
          !job.jobRole.toLowerCase().includes(filters.role.toLowerCase())
        ) {
          return false;
        }
        if (filters.experience !== null && job.minExp >= filters.experience) {
          return false;
        }
        if (filters.salary !== null && job.minJdSalary <= filters.salary) {
          return false;
        }
        if (filters.location !== "") {
          if (filters.location === "In-Office") {
            const isRemoteOrHybrid = filtersData.location.some((locationType) =>
              job.location.toLowerCase().includes(locationType.toLowerCase())
            );
            return !isRemoteOrHybrid;
          } else {
            return job.location
              .toLowerCase()
              .includes(filters.location.toLowerCase());
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
            width: "100%",
            margin: "0 auto 1rem auto",
            flexWrap: "wrap",
            ">*": {
              marginRight: "0.5rem",
            },
          }}
        >
          <FormControl sx={{ width: "10vw" }}>
            <InputLabel>Roles</InputLabel>
            <Select value={filters.role} onChange={handleFilter} name="role">
              <MenuItem value="">All</MenuItem>
              {filtersData?.roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: "10vw" }}>
            <InputLabel>Experience</InputLabel>
            <Select
              value={filters.experience}
              onChange={handleFilter}
              name="experience"
            >
              <MenuItem value={null}>All</MenuItem>
              {filtersData?.experience.map((years) => (
                <MenuItem key={years} value={years}>
                  {years}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: "10vw" }}>
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
          <FormControl sx={{ width: "10vw" }}>
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
          <TextField
            label="Search Jobs"
            value={searchQuery}
            onChange={handleSearch}
          />
        </Box>

        <Grid container spacing={2}>
          {jobsToDisplay?.map((job, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  {/* <Typography variant="subtitle1">{index + 1}</Typography> */}
                  <Typography variant="h8">{job.companyName}</Typography>
                  <Typography variant="subtitle1">{job.jobRole}</Typography>
                  <Typography>
                    {job.minExp && `${job.minExp}`} -{" "}
                    {job.maxExp && `${job.maxExp}`} Years
                  </Typography>
                  <Typography>{job.location}</Typography>
                  <Typography>{job.jobDetailsFromCompany}</Typography>
                  <Typography>
                    {job.minJdSalary && `Min Salary: ${job.minJdSalary}`}
                  </Typography>
                  <Typography>
                    {job.maxJdSalary && `Max Salary: ${job.maxJdSalary}`}
                  </Typography>
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
