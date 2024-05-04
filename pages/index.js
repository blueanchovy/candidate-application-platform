import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [jobData, setJobData] = useState();
  const [jobsToDisplay, setJobsToDisplay] = useState([]);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const BASE_URL = "https://api.weekday.technology/adhoc/getSampleJdJSON";
  const [totalLoaded, setTotalLoaded] = useState(0);
  // console.log("totalLoaded", totalLoaded);

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
      setJobData(result);
      // console.log("new fetched", result.jdList.length);
      if (result?.jdList.length > 0) {
        setJobsToDisplay((prevJobs) => prevJobs.concat(result.jdList));
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
    if (jobData) return;
    debouncedGetJobsData();
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

  return (
    <>
      <Head>
        <title>Candidate Application Platform</title>
        <meta name="description" content="Weekday - Assignment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Grid container spacing={2}>
          {jobsToDisplay?.map((job, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  {/* <Typography variant="subtitle1">{index + 1}</Typography> */}
                  <Typography variant="h8">{job.companyName}</Typography>
                  <Typography variant="subtitle1">{job.jobRole}</Typography>
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
