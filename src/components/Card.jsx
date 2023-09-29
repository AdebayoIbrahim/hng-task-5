import React from "react";
import { Card, CardContent } from "@mui/material";
const CardBox = ({ children }) => {
  return (
    <React.Fragment>
      <Card
        sx={{
          background: "transparent",
          color: "black",
          borderRadius: "1.2em",
          border: "1px solid #120B48",
          marginBottom: "1.5rem !important",
          boxShadow: "none !important",
        }}
      >
        <CardContent
          sx={{
            paddingBlock: ".3rem !important",
            paddingInline: ".8rem !important",
          }}
        >
          {children}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default CardBox;
