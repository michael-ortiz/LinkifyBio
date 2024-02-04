import { ListItemText, ListItem, List, Box, Container, Divider, ListItemIcon, Card, IconButton, Breadcrumbs, Typography, Link } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../context/GlobalContext';
import { Link as LinkIcon } from '@mui/icons-material';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import { ArrowBack, Visibility } from '@mui/icons-material';
import { getPage } from '../../../api/admin/AdminApi';

function PageAndLinkViews() {
    const navigate = useNavigate();

    const { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {

        getPage(state.selectedPage.id).then((data) => {
            dispatch({ type: 'SET_SELECTED_PAGE', payload: data });
        });
    }, []);

    const linkViews = state.selectedPage.linkViews.map(view => {
        const link = state.selectedPage.links.find(link => link.id === view.id);
        return {
            ...view,
            name: link ? link.name : 'Unknown link name'
        };
    });

    const pageViews = state.selectedPage.pageViews || { views: 0 };

    document.body.scrollTop = document.documentElement.scrollTop = 0;

    return (
        <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>

            <Header />

            <Box sx={MainBoxStyle}>

                <Box display="flex" justifyContent="left" alignItems="center">
                    <IconButton onClick={() => navigate('/console/actions')}>
                        <ArrowBack />
                    </IconButton>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/console">
                            home
                        </Link>
                        <Link underline="hover" color="inherit" href="/console/actions">
                            {state.selectedPage.id}
                        </Link>
                        <Typography color="text.primary">views & clicks</Typography>
                    </Breadcrumbs>
                </Box>


                <h2>Page Views</h2>

                <nav>
                    <List>
                        <React.Fragment>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <Visibility />
                                </ListItemIcon>

                                <ListItemText primary={state.selectedPage.id} secondary={"Views: " + pageViews.views} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    </List>
                </nav>

                <h2>Link Clicks</h2>

                <nav>
                    <List>
                        {linkViews > 0 && <Divider />}
                        {linkViews.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <LinkIcon />
                                    </ListItemIcon>

                                    <ListItemText primary={item.name} secondary={"Clicks: " + item.views} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    {linkViews.length === 0 && <center><p>No clicks</p></center>}
                </nav>

            </Box>

        </Container>
    );
}

export default PageAndLinkViews;

