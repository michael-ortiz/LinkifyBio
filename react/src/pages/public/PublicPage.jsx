import Button from '@mui/material-next/Button';
import { Container, Avatar, CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { getPublicPage } from '../../api/public/PublicApi';
import React from 'react';
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons'
import { Helmet } from 'react-helmet';
import { DefaultPageColors } from '../../constants/DefaultColors';
import { incrementClickView } from '../../api/public/PublicApi';
export default class PublicPage extends React.Component {

    defaultColors = DefaultPageColors;

    state = {
        pageId: '',
        bioInfo: {},
        links: [],
        socialMediaLinks: [],
        isImageLoaded: false,
        isLoading: true,
        pageColors: this.defaultColors,
        error: false
    };

    componentDidMount() {
        const id = window.location.href.split('/')[3]
        getPublicPage(id).then((data) => {
            this.setState({ pageId: data.id });
            this.setState({ bioInfo: data.bioInfo });
            this.setState({ links: data.links });
            this.setState({ socialMediaLinks: data.socialMediaLinks });

            if (data.pageColors !== undefined) {
                this.setState({ pageColors: data.pageColors });
                this.setBackgroundColor(data.pageColors.backgroundColor)
            }

            this.setState({ pageColors: data.pageColors ?? this.defaultColors });
            this.setState({ isLoading: false })
            this.setState({ error: false })
        }).catch((error) => {
            this.setState({ error: true })
            this.setBackgroundColor(this.state.pageColors.backgroundColor)
        });

    }

    setBackgroundColor = (color) => {
        document.body.style.backgroundColor = color;
    }

    render() {

        if (!this.state.error) {

            return (
                <Container maxWidth="sm">
                    <Helmet>
                        <title>{`${this.state.bioInfo.name === undefined ? "Loading" : this.state.bioInfo.name} - LinkifyBio`}</title>
                    </Helmet>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1} width="100%">
                            <Box justifyContent="center" marginTop={10} alignItems="center" textAlign="center">
                                <center>

                                    {this.state.isLoading && <CircularProgress />}

                                    <Avatar
                                        src={this.state.bioInfo.imageUrl}
                                        onLoad={() => this.setState({ isImageLoaded: true })}
                                        sx={{ width: 100, height: 100, display: this.state.isImageLoaded ? 'block' : 'none' }}
                                    />
                                </center>
                                <h1 style={{ color: this.state.pageColors.textColor }}>{this.state.bioInfo.name}</h1>
                                <p style={{ color: this.state.pageColors.textColor }}>{this.state.bioInfo.descriptionTitle}</p>
                            </Box>

                            <Box display="flex" justifyContent="center" alignItems="center" marginBottom={4} flexWrap="wrap">
                                {
                                    this.state.socialMediaLinks.map((link, index) => (
                                        <Box key={index} margin={1}>
                                            <SocialIcon url={link.url} bgColor="transparent" fgColor={this.state.pageColors.socialIconsColor} />
                                        </Box>
                                    ))
                                }
                            </Box>

                            {this.state.links ?
                                this.state.links.map((link, index) => (
                                    <Box key={index} width="100%">

                                        <Box key={index} width="100%" style={{ marginBottom: '10px' }}> {/* Add this line */}
                                            <Button
                                                color="tertiary"
                                                size="large"
                                                variant="filled"
                                                href={link.url}
                                                target='_blank'
                                                sx={{
                                                    width: "100%",
                                                    backgroundColor: this.state.pageColors.buttonColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center', // Change this line
                                                    padding: '12px',
                                                    '&:hover': {
                                                        backgroundColor: this.state.pageColors.buttonHoverColor,
                                                    }
                                                }}
                                                onClick={() => {
                                                    incrementClickView(this.state.pageId, link.id)
                                                }}
                                            >
                                                <SocialIcon url={link.url}  bgColor="transparent" fgColor={this.state.pageColors.buttonLinkIconColor} style={{ height: 30, width: 30 }} />
                                                <Box style={{ textAlign: 'center', flexGrow: 1, marginRight: 30, color: this.state.pageColors.buttonTextColor }}>
                                                    {link.name}
                                                </Box>
                                            </Button>
                                        </Box>
                                    </Box>
                                ))
                                : <Box><h1>No links found</h1></Box>
                            }
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="center" sx={{ marginTop: 5 }}>
                        <Button variant="filled"
                            href='https://linkifybio.com'
                            sx={{
                                color: "#8f2f00",
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'gainsboro',
                                }
                            }}

                            startIcon={
                                <img
                                    src={'/logox100.png'}
                                    style={{ height: 20, width: 20, marginRight: -3 }}
                                    draggable="false"
                                    alt='linkifybio'
                                />}>
                            Create your LinkifyBio
                        </Button>
                    </Box>
                </Container>
            );

        } else {

            return (
                <Container maxWidth="sm" style={{ height: '100vh' }}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                        <Typography variant="h2" align="center">Oops!</Typography>
                        <Typography variant="h2" align="center">Page Not Found</Typography>

                        <Button variant="contained" href='https://linkifybio.com' sx={{ marginTop: 10, color: "#8f2f00" }} color="primary" startIcon={
                            <img
                                src={'/logox100.png'}
                                style={{ height: 20, width: 20, marginRight: -3 }}
                                draggable="false"
                                alt='linkifybio'
                            />}>
                            Create your LinkifyBio
                        </Button>

                    </Box>
                </Container>
            )

        }


    }
}

