import React, { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Container, Box, useMediaQuery } from '@mui/material';
import Button from '@mui/material-next/Button';
import { useNavigate } from 'react-router-dom';
import HeaderPublic from '../../components/HeaderPublic';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from '@aws-amplify/auth';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';

export default function PublicMainPage() {

    const navigate = useNavigate();

    const [showAuth, setShowAuth] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [index, setIndex] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const rollCompanies = [
        { name: 'X', color: '#1DA1F2' },
        { name: 'Facebook', color: '#3B5998' },
        { name: 'Instagram', color: '#E1306C' },
        { name: 'LinkedIn', color: '#0077B5' },
        { name: 'Website', color: 'blue' },
        { name: 'Blog', color: 'orange' }
    ]

    useEffect(() => {

        getCurrentUser().then((data) => {

            if (data) {
                setIsSignedIn(true)
            }
        }).catch((error) => {
            setIsSignedIn(false);

        });

    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % rollCompanies.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [rollCompanies.length]);

    const handleAuthClick = () => {

        if (isSignedIn || import.meta.env.VITE_NODE_ENV === 'local') {
            navigate('/console');
        } else {
            setShowAuth(true);
        }

    }

    const authListener = (data) => {

        if (data.payload.event === 'signedIn') {
            setShowAuth(false);
            navigate('/console');
        }
    };

    Hub.listen('auth', authListener);

    return (
        <Container maxWidth="false" sx={{ height: '100vh', width: '100vw' }}>

            <Helmet>
                <title>LinkifyBio: A Public Page for your Links in Bio</title>
                <meta name="description" content="Create a centralized public page for all your social media links. Share this link in your bio and let your followers access all your platforms from one place."/>
            </Helmet>

            <HeaderPublic />

            <Box display="flex" justifyContent="center" alignItems="center" marginTop={[2, 10]}>

                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1} width="100%">

                    {!showAuth && <Button
                        color="tertiary"
                        size="large"
                        variant="filled"
                        sx={{
                            textAlign: "center",
                            backgroundColor: "#000000",
                            marginBottom: 4,
                            '&:hover': {
                                backgroundColor: "#808080"
                            }
                        }}
                        onClick={handleAuthClick}
                    >
                        {isSignedIn ? "Go to Console" : "Log In or Create Account"}
                    </Button>}

                    {!showAuth &&

                        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="center" alignItems="center">

                            <Box>

                                <Typography variant="h3" align={isMobile ? "left" : "right"} style={{ fontWeight: 'bold' }}>
                                    Create a
                                </Typography>
                                <Typography variant="h3" align={isMobile ? "left" : "right"} style={{ fontWeight: 'bold' }}>
                                    public page for
                                </Typography>
                                <Typography variant="h2" align={isMobile ? "left" : "right"} style={{ color: rollCompanies[index].color, fontWeight: 'bold' }}>
                                    {rollCompanies[index].name}
                                </Typography>
                                <Typography variant="h3" align={isMobile ? "left" : "right"} style={{ fontWeight: 'bold' }}>
                                    to showcase
                                </Typography>
                                <Typography variant="h3" align={isMobile ? "left" : "right"} style={{ fontWeight: 'bold' }}>
                                    your links
                                </Typography>
                                <Typography variant="h3" align={isMobile ? "left" : "right"} style={{ fontWeight: 'bold' }}>
                                    in bios!
                                </Typography>
                            </Box>

                            <img src='/welcome-image-screens.png' alt="description" style={{ marginRight: '1em', width: !isMobile ? "50%" : "100%" }} />

                        </Box>

                    }

                    {showAuth &&
                        <Authenticator loginMechanisms={['email']} socialProviders={["google"]} />
                    }

                </Box>
            </Box>
        </Container>
    );
}