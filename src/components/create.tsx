import React from "react";
import { Button } from "./ui/button";
import { queueSong } from "~/actions/generation";

function CreateSong() {
  return <Button onClick={queueSong}>Generate Song</Button>;
}

export default CreateSong;
