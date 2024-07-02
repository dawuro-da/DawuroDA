import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { ReactNode } from "react";

interface AnchorTemporaryDrawerProps {
  isOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  content: ReactNode;
}

export default function AnchorTemporaryDrawer({
  isOpen,
  toggleDrawer,
  content,
}: AnchorTemporaryDrawerProps) {
  const list = () => (
    <Box sx={{ width: 700 }} >
      {content}
    </Box>
  );

  return (
    <Drawer anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}
