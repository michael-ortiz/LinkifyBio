import { useEffect, useState } from 'react';
import Button from '@mui/material-next/Button';
import { Container, Avatar, CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { getPublicPage } from '../../api/public/PublicApi';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons';
import { Helmet } from 'react-helmet';
import { DefaultPageColors } from '../../constants/DefaultColors';
import { incrementClickView } from '../../api/public/PublicApi';

const defaultColors = DefaultPageColors;

const PublicPage = () => {
  const [pageId, setPageId] = useState('');
  const [bioInfo, setBioInfo] = useState({});
  const [links, setLinks] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageColors, setPageColors] = useState(defaultColors);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('Page Loaded TAMO');
    const id = window.location.href.split('/')[3];
    getPublicPage(id)
      .then((data) => {
        setPageId(data.id);
        setBioInfo(data.bioInfo);
        setLinks(data.links);
        setSocialMediaLinks(data.socialMediaLinks);

        if (data.pageColors !== undefined) {
          setPageColors(data.pageColors);
          setBackgroundColor(data.pageColors.backgroundColor);
        }

        setPageColors(data.pageColors ?? defaultColors);
        setIsLoading(false);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setBackgroundColor(pageColors.backgroundColor);
      });
  }, [pageId]);

  const setBackgroundColor = (color) => {
    document.body.style.backgroundColor = color;
  };

  if (!error) {
    return (
      <Container maxWidth="sm">
        <Helmet>
          <title>{`${bioInfo.name === undefined ? 'Loading' : bioInfo.name} - LinkifyBio`}</title>
        </Helmet>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
            width="100%"
          >
            <Box
              justifyContent="center"
              marginTop={10}
              alignItems="center"
              textAlign="center"
            >
              <center>
                {isLoading && <CircularProgress />}

                <Avatar
                  src={bioInfo.imageUrl}
                  onLoad={() => setIsImageLoaded(true)}
                  sx={{
                    width: 100,
                    height: 100,
                    display: isImageLoaded ? 'block' : 'none',
                  }}
                />
              </center>
              <h1 style={{ color: pageColors.textColor }}>{bioInfo.name}</h1>
              <p style={{ color: pageColors.textColor }}>
                {bioInfo.descriptionTitle}
              </p>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              marginBottom={4}
              flexWrap="wrap"
            >
              {socialMediaLinks.map((link, index) => (
                <Box key={index} margin={1}>
                  <SocialIcon
                    url={link.url}
                    bgColor="transparent"
                    fgColor={pageColors.socialIconsColor}
                  />
                </Box>
              ))}
            </Box>

            {links ? (
              links.map((link, index) => (
                <Box key={index} width="100%">
                  <Box
                    key={index}
                    width="100%"
                    style={{ marginBottom: '10px' }}
                  >
                    <Button
                      color="tertiary"
                      size="large"
                      variant="filled"
                      href={link.url}
                      target="_blank"
                      sx={{
                        width: '100%',
                        backgroundColor: pageColors.buttonColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Change this line
                        padding: '12px',
                        '&:hover': {
                          backgroundColor: pageColors.buttonHoverColor,
                        },
                      }}
                      onClick={() => {
                        incrementClickView(pageId, link.id);
                      }}
                    >
                      <SocialIcon
                        url={link.url}
                        bgColor="transparent"
                        fgColor={pageColors.buttonLinkIconColor}
                        style={{ height: 30, width: 30 }}
                      />
                      <Box
                        style={{
                          textAlign: 'center',
                          flexGrow: 1,
                          marginRight: 30,
                          color: pageColors.buttonTextColor,
                        }}
                      >
                        {link.name}
                      </Box>
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Box>
                <h1>No links found</h1>
              </Box>
            )}
          </Box>
        </Box>

        {!isLoading && (
          <Box display="flex" justifyContent="center" sx={{ marginTop: 5 }}>
            <Button
              variant="filled"
              href="https://linkifybio.com"
              sx={{
                color: '#8f2f00',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'gainsboro',
                },
              }}
              startIcon={
                <img
                  src={'/logox100.png'}
                  style={{ height: 20, width: 20, marginRight: -3 }}
                  draggable="false"
                  alt="linkifybio"
                />
              }
            >
              Create your LinkifyBio
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ height: '100vh' }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        style={{ height: '100%' }}
      >
        <Typography variant="h2" align="center">
          Oops!
        </Typography>
        <Typography variant="h2" align="center">
          Page Not Found
        </Typography>

        <Button
          variant="contained"
          href="https://linkifybio.com"
          sx={{ marginTop: 10, color: '#8f2f00' }}
          color="primary"
          startIcon={
            <img
              src={'/logox100.png'}
              style={{ height: 20, width: 20, marginRight: -3 }}
              draggable="false"
              alt="linkifybio"
            />
          }
        >
          Create your LinkifyBio
        </Button>
      </Box>
    </Container>
  );
};

export default PublicPage;
