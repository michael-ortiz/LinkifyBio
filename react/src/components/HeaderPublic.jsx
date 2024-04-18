import { Box } from "@mui/material";

function HeaderPublic() {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box
        onClick={() => window.location.reload()}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <img
          src={"/logox100.png"}
          style={{
            height: 30,
            width: 30,
            marginRight: 5,
            userSelect: "none",
            userDrag: "none",
          }}
          draggable="false"
          alt="linkifybio"
          onClick={() => window.location.reload()}
        />

        <h3 style={{ userSelect: "none", color: "#8f2f00" }}>LinkifyBio</h3>
      </Box>
    </Box>
  );
}
export default HeaderPublic;

