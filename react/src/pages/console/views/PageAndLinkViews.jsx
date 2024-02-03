import { ListItemText, ListItem, List, Box, Container, Divider, ListItemIcon, Card, IconButton, Breadcrumbs, Typography, Link } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../context/GlobalContext';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Link as LinkIcon } from '@mui/icons-material';
import Header from '../../../components/Header';
import { MainBoxStyle } from '../../../constants/Styles';
import { ArrowBack } from '@mui/icons-material';

function PageAndLinkViews() {
    const navigate = useNavigate();

    const { state } = useContext(GlobalContext);

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
                        <Typography color="text.primary">views</Typography>
                    </Breadcrumbs>
                </Box>


                <h2>Total Page Views</h2>

                <center>
                    <Card variant="outlined" sx={{ width: '30%' }}>
                        <h2>{pageViews.views}</h2>
                    </Card>
                </center>

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
                    {linkViews.length === 0 && <center><h3>No clicks</h3></center>}
                </nav>

            </Box>

        </Container>
    );
}

export default withAuthenticator(PageAndLinkViews);

