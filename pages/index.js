import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { capitalizeFirstLetterOfEachWord, debounce } from "@/utils/common";
import JobDetailsCard from "@/components/JobDetailsCard";
import JobFiltersSection from "@/components/JobFiltersSection";
import CircularLoader from "@/components/CircularLoader";

const inter = Inter({ subsets: ["latin"] });

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
        <JobFiltersSection
          handleSearch={handleSearch}
          handleFilter={handleFilter}
          setSearchQuery={setSearchQuery}
          roleSearchQuery={roleSearchQuery}
          setRoleSearchQuery={setRoleSearchQuery}
          experienceSearchQuery={experienceSearchQuery}
          setExperienceSearchQuery={setExperienceSearchQuery}
          salarySearchQuery={salarySearchQuery}
          setSalarySearchQuery={setSalarySearchQuery}
          locationSearchQuery={locationSearchQuery}
          setLocationSearchQuery={setLocationSearchQuery}
          rolesToDisplay={rolesToDisplay}
          locationsToDisplay={locationsToDisplay}
          filters={filters}
        />
        <Grid container spacing={5}>
          {jobsToDisplay?.map((job, index) => (
            <JobDetailsCard key={index} job={job} />
          ))}
        </Grid>
        <CircularLoader loading={loadingMoreData} />
      </main>
    </>
  );
}
