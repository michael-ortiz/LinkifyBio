import { ListItemText, ListItem, List, Box, Container, Divider, ListItemIcon, Alert } from '@mui/material';
import { listPages } from '../../api/admin/AdminApi';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';
import { Public, Check } from '@mui/icons-material';
import Button from '@mui/material-next/Button';
import Header from '../../components/Header';
import { MainBoxStyle } from '../../constants/Styles';
import { CircularProgress } from '@mui/material';

function MainPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = React.useState(false);

    const { state, dispatch } = useContext(GlobalContext);

    document.body.scrollTop = document.documentElement.scrollTop = 0;

    useEffect(() => {

        setIsLoading(true);
        listPages().then((data) => {
            dispatch({ type: 'SET_PAGES', payload: data });
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>

            <Header />

            <Box sx={MainBoxStyle}>

                {state.didCreatePage && (
                    <Alert icon={<Check fontSize="inherit" />} severity="success">
                        Page created successfully!
                    </Alert>
                )}


                <h1>Public Pages</h1>

                <Button
                    color="tertiary"
                    size="large"
                    variant="filled"
                    onClick={() => {
                        dispatch({ type: 'SET_SELECTED_PAGE', payload: {} });
                        dispatch({ type: 'SET_ALIAS', payload: '' });
                        navigate('/console/page/create/alias')
                    }}

                    sx={{
                        width: "100%",
                        textAlign: "center",
                        backgroundColor: "#000000",
                        marginTop: 4,
                        marginBottom: 4,
                        '&:hover': {
                            backgroundColor: "#808080"
                        }
                    }}
                >
                    Create Page
                </Button>

                <center>{isLoading && <CircularProgress />}</center>


                <nav>
                    <List>
                        { state.pages.length > 0 && <Divider /> } 
                        { state.pages.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    sx={{
                                        width: '100%',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        }
                                    }}
                                    onClick={() => {
                                        dispatch({ type: 'SET_SELECTED_PAGE', payload: item });
                                        navigate(`/console/actions`)
                                    }
                                    }
                                >
                                    <ListItemIcon>
                                        <Public />
                                    </ListItemIcon>

                                    <ListItemText primary={item.id} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </nav>

            </Box>

        </Container>
    );
}

export default MainPage;

