import { FaRegCopyright } from "react-icons/fa";
import Container from "react-bootstrap/Container";

export default function Footer() {
  return (
    <>
      <Container
        fluid
        style={{
          margin: "100px auto 50px auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTop: "1px solid rgb(255,255,255,0.2) ",
        }}
      >
        <p
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
            marginTop: "50px",
            fontSize: "20px",
          }}
        >
          <FaRegCopyright />
          2024 Syntax Blog
        </p>
        <p style={{ fontSize: "20px" }}>All Rights Reserved</p>
      </Container>
    </>
  );
}
