import { Box } from "@mui/material";
import ActivityList from './ActivityList';

const drawerWidth = 240

const ActivityBar = () => {
    return (


<Box
   sx={{
    display: {
        xs: 'none',
        md: 'flex'
    },
    width: {
        md: '25%',
    },
    background: '#f0f0f0',
    height: '90vh',
  }}
>
  <ActivityList />
</Box>

    )
}

export default ActivityBar;