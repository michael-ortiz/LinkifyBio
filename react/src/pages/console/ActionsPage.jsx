import { ListItemText, ListItem, List, Box, Container, Divider, Link, Breadcrumbs, Typography, IconButton, ListItemIcon } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';
import { Link as linksIcon, ArrowBack, Public, Settings, Visibility, Palette, BarChart } from '@mui/icons-material';
import copy from 'copy-to-clipboard';
import Button from '@mui/material-next/Button';
import Header from '../../components/Header';
import { MainBoxStyle } from '../../constants/Styles';

function ActionsPage() {

    const navigate = useNavigate();

    const { state } = useContext(GlobalContext);
    const [isCopied, setIsCopied] = useState(false);

    const { selectedPage } = state;

    document.body.scrollTop = document.documentElement.scrollTop = 0;

    const options = [
        {
            title: "View Page",
            path: `/${selectedPage.id}`,
            icon: Visibility,
            openNewTab: true
        },
        {
            title: "Manage Links",
            path: "/console/links/view",
            icon: linksIcon,
            openNewTab: false
        },
        {
            title: "Manage Social Icons Links",
            path: "/console/social/view",
            icon: Public,
            openNewTab: false
        },
        {
            title: "Page Colors",
            path: "/console/page/colors",
            icon: Palette,
            openNewTab: false
        },
        {
            title: "Page Views & Clicks",
            path: "/console/page/views",
            icon: BarChart,
            openNewTab: false
        },
        {
            title: "Page Settings",
            path: "/console/page/settings",
            icon: Settings,
            openNewTab: false
        }
    ]

    return (

        <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>

            <Header />

            <Box sx={MainBoxStyle}>

                <Box display="flex" justifyContent="left" alignItems="center">
                    <IconButton onClick={() => navigate('/console')}>
                        <ArrowBack />
                    </IconButton>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/console">
                            home
                        </Link>
                        <Typography color="text.primary">{selectedPage.id}</Typography>
                    </Breadcrumbs>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2} padding={2} bgcolor="#f5f5f5" color="black" borderRadius={5}>
                    <Box>
                        <Typography variant="body2" style={{ fontWeight: 'bold', color: "#006400" }}>
                            Your page is live:
                        </Typography>
                        <Box component="span">
                            <Link href={`/${selectedPage.id}`} style={{ color: 'black' }}>
                                {`https://linkifybio.com/${selectedPage.id}`}
                            </Link>                        </Box>
                    </Box>
                    <Box component="span">
                        <Button color="primary"
                            size="small"
                            variant="filled"
                            style={{ backgroundColor: 'black', color: 'white' }}
                            onClick={() => {
                                copy(`https://linkifybio.com/${selectedPage.id}`);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000); // Change back after 2 seconds
                            }}>
                            {isCopied ? "Copied!" : "Copy URL"}
                        </Button>
                    </Box>
                </Box>

                <h1>Actions</h1>
                <nav>
                    <List>
                        <Divider />
                        {options.map((selectOption, index) => (

                            <React.Fragment key={index}>
                                <a href={selectOption.path} target={selectOption.openNewTab ? "_blank" : ""} rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                                    <ListItem
                                        sx={{
                                            width: '100%',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <selectOption.icon />
                                        </ListItemIcon>

                                        <ListItemText primary={selectOption.title} />

                                    </ListItem>
                                </a>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </nav>
            </Box>
        </Container>
    );
}

export default ActionsPage;

