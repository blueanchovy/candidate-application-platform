import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [jobData, setJobData] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);
  const BASE_URL = "https://api.weekday.technology/adhoc/getSampleJdJSON";
  console.log(filteredJobs);

  useEffect(() => {
    async function getJobsData() {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const body = JSON.stringify({
          limit: 10,
          offset: 0,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body,
        };

        const response = await fetch(BASE_URL, requestOptions);
        const result = await response.json();
        setJobData(result);
        setFilteredJobs(result?.jdList || []);
      } catch (error) {
        console.error(error);
      }
    }

    getJobsData();
  }, []);

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
          {filteredJobs?.map((job, index) => {
            return (
              <>
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
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
              </>
            );
          })}
        </Grid>
      </main>
    </>
  );
}
