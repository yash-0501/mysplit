import { Box, useThemeProps } from "@mui/material";
import ActivityList from "./ActivityList";

const drawerWidth = 240;

const ActivityBar = ({ props }) => {
  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "flex",
        },
        width: {
          md: "25%",
        },
        background: "#f0f0f0",
        height: "100%",
      }}
    >
      <ActivityList props={props} />
    </Box>
  );
};

export default ActivityBar;
