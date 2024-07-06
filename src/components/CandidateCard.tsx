import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

export default function CandidateCard(props: {
  selected: boolean;
  name: string;
  address: string;
  id: bigint;
  onClick: () => void;
}) {
  return (
    <Card
      sx={{ maxWidth: 345, cursor: "pointer", mr: 1 }}
      onClick={props.onClick}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="voter-image.jpg"
          alt={props.name}
        />
        <CardContent
          sx={{
            textAlign: "center",
            backgroundColor: props.selected ? "#eeeeee" : "#bcbcbc",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textOverflow: "ellipsis" }}
          >
            ID: {props.id.toString()}
            <br />
            Address:{" "}
            <Link
              target="_blank"
              color="inherit"
              href={`https://sepolia.etherscan.io/address/${props.address}`}
            >
              {props.address.slice(0, 6) + "..." + props.address.slice(-4)}
              <ArrowOutwardIcon color="inherit" />
            </Link>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
