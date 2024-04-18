export const MainBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: ['flex-start'], // Change this line
  height: 'calc(100vh - 70px)',
  width: ['100%', '40%'],
  bgcolor: 'background.paper',
  margin: '0 auto',
};

export const ColorPickerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};
