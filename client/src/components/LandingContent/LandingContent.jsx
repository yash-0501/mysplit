import { Box, Typography } from "@mui/material";

const LandingContent = ({props}) => {

    const user = props;

    return (
        <Box sx={{
            width: {
                xs: '100%',
                md: '75%',
            },
            background: 'red',
            display: 'block'
        }}>
            <Typography variant="h1">Landing Page</Typography>
            {!!user && (<Typography variant="h5">Hi {user.name}!</Typography>)}
            {!!user && (<Typography>Logged In as: {user.email}</Typography>)}
        </Box>
    )
}

export default LandingContent;