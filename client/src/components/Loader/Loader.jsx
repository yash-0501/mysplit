import { Box } from '@mui/material';
import { Oval } from 'react-loader-spinner';

const Loader = () => {
    return (
        <Box sx={{
            position:'absolute',
            left:'50%',
            top:'50%',
            transform: "translate(-50%, -50%)",
        }}>
            <Oval
  visible={true}
  height="40"
  width="40"
  color="#4fa94d"
  ariaLabel="oval-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
        </Box>
    )
}

export default Loader;