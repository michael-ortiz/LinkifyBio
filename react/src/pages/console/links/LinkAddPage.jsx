import { Container, TextField, Box, IconButton, Breadcrumbs, Link, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { addLink, getPage } from '../../../api/admin/AdminApi';
import { GlobalContext } from '../../../context/GlobalContext';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import CircularProgress from '@mui/material/CircularProgress';

function LinkAddPage() {

    const navigate = useNavigate();

    const { state, dispatch } = useContext(GlobalContext);

    const [linkName, setLinkName] = React.useState('');
    const [linkUrl, setLinkUrl] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        addLink(state.selectedPage.id, {
            name: linkName,
            url: linkUrl
        }).then((data) => {

            setIsLoading(false);

            getPage(state.selectedPage.id).then((data) => {
                dispatch({ type: 'SET_SELECTED_PAGE', payload: data });
                navigate(`/console/links/view`)
            });

        }).catch((error) => {
            alert('Failed to add link. Please check for a valid name and URL and try again.');
            console.error(error);
            setIsLoading(false);
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>

            <Header />

            <Box sx={MainBoxStyle}>
                <Box display="flex" justifyContent="left" alignItems="center">
                    <IconButton onClick={() => navigate('/console/links/view')}>
                        <ArrowBack />
                    </IconButton>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/console">
                            home
                        </Link>
                        <Link underline="hover" color="inherit" href="/console/actions">
                            {state.selectedPage.id}
                        </Link>
                        <Link underline="hover" color="inherit" href="/console/links/view">
                            links
                        </Link>
                        <Typography color="text.primary">add</Typography>
                    </Breadcrumbs>
                </Box>

                <h1>Add Link</h1>

                <form autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />

                    <TextField
                        type="url"
                        id="url"
                        label="URL"
                        variant="outlined"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />

                    <Button
                        color="tertiary"
                        size="large"
                        variant="filled"
                        sx={{
                            width: "100%", textAlign: "center", backgroundColor: "#000000", '&:hover': {
                                backgroundColor: "#808080", // Change this to your desired highlight color
                            }
                        }}
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </form>
            </Box>
        </Container>


    );
}

export default LinkAddPage;

