import { Grid } from "@mui/material";
import React from "react";
import JobDetailsCard from "./JobDetailsCard";
import CircularLoader from "./CircularLoader";

function JobDetailsSection({ jobsToDisplay = [], loading = false }) {
  return (
    <>
      <Grid container spacing={5}>
        {jobsToDisplay?.map((job, index) => (
          <JobDetailsCard key={index} job={job} />
        ))}
      </Grid>
      <CircularLoader loading={loading} />
    </>
  );
}

export default React.memo(JobDetailsSection);
