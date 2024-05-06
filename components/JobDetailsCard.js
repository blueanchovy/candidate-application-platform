import { capitalizeFirstLetterOfEachWord } from "@/utils/common";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";

function JobDetailsCard({ job = {} }) {
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
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
                  {job?.jobDetailsFromCompany?.slice(0, 500)}
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
    </>
  );
}

export default React.memo(JobDetailsCard);
