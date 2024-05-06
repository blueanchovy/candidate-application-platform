import { Grid } from "@mui/material";
import React from "react";
import CircularLoader from "./CircularLoader";
import dynamic from "next/dynamic";

const DynamicJobDetailsCard = dynamic(() => import("./JobDetailsCard"), {
  loading: () => <></>,
});

function JobDetailsSection({ jobsToDisplay = [], loading = false }) {
  return (
    <>
      <Grid container spacing={5}>
        {jobsToDisplay?.map((job, index) => (
          <DynamicJobDetailsCard key={index} job={job} />
        ))}
      </Grid>
      <CircularLoader loading={loading} />
    </>
  );
}

export default React.memo(JobDetailsSection);
