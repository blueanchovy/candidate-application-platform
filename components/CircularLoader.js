import { Box, CircularProgress } from "@mui/material";
import React from "react";

function CircularLoader({ loading = false }) {
  return (
    <>
      {loading && (
        <Box
          sx={{
            display: "flex",
            padding: "1rem",
            color: "blue",
          }}
        >
          <CircularProgress value={loading} />
        </Box>
      )}
    </>
  );
}

export default CircularLoader;
