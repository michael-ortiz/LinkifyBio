import { Container, TextField, Box, Link, Typography, IconButton, Breadcrumbs } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material-next/Button';
import { updateLink, deleteLink, getPage } from '../../../api/admin/AdminApi';
import { GlobalContext } from '../../../context/GlobalContext';
import { Delete, ArrowBack } from '@mui/icons-material';
import { useConfirm } from "material-ui-confirm";
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import CircularProgress from '@mui/material/CircularProgress';

function LinkEditorPage() {

    const navigate = useNavigate();
    const confirm = useConfirm();

    const { state, dispatch } = useContext(GlobalContext);

    const [linkName, setLinkName] = React.useState(state.selectedLink.name || '');
    const [linkUrl, setLinkUrl] = React.useState(state.selectedLink.url || '');
    const [isLoading, setIsLoading] = React.useState(false);


    const handleSubmit = async () => {
        setIsLoading(true);
        updateLink(state.selectedPage.id, {
            id: state.selectedLink.id,
            name: linkName,
            url: linkUrl,
            position: state.selectedLink.position
        }).then((data) => {

            getPage(state.selectedPage.id).then((data) => {
                setIsLoading(false);
                dispatch({ type: 'SET_SELECTED_PAGE', payload: data });
                navigate(`/console/links/view`)
            });

        });
    };

    const deleteLinkAction = async (id, name) => {

        confirm({ title: name, description: `Are you sure you want to delete this link?` })
            .then(() => {
                try {
                    deleteLink(state.selectedPage.id, id).then((data) => {
                        getPage(state.selectedPage.id).then((data) => {
                            dispatch({ type: 'SET_SELECTED_PAGE', payload: data });
                            navigate(`/console/links/view`)
                        });
                    });

                } catch (error) {
                    console.error('Failed to delete link:', error);
                    alert('Could not delete link. Please try again later.');

                }
            })
            .catch(() => {

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
                        <Typography color="text.primary">edit</Typography>
                    </Breadcrumbs>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <h1>Edit Link</h1>
                    <IconButton onClick={() => deleteLinkAction(state.selectedLink.id, state.selectedLink.name)}>
                        <Delete />
                    </IconButton>
                </Box>

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
                        id="url"
                        type="url"
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

export default LinkEditorPage;

