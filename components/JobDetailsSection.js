import { Grid } from "@mui/material";
import React from "react";
import JobDetailsCard from "./JobDetailsCard";

function JobDetailsSection({ jobsToDisplay = [] }) {
  return (
    <>
      <Grid container spacing={5}>
        {jobsToDisplay?.map((job, index) => (
          <JobDetailsCard key={index} job={job} />
        ))}
      </Grid>
    </>
  );
}

export default React.memo(JobDetailsSection);
