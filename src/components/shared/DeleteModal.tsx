import { Close } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";

const DeleteModal = ({
  onClose,
  open,
  nameTobeDeleted,
  onRemove,
  itemName,
}: {
  onClose: () => void;
  open: boolean;
  nameTobeDeleted: string;
  onRemove: () => void;
  itemName: string;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex flex-col items-center max-w-[600px] p-6">
        <div className="w-full flex flex-row justify-end">
          <Close onClick={onClose} className="cursor-pointer" />
        </div>
        <div className="flex flex-col items-center gap-6 px-12 py-6">
          <span className="font-bold text-3xl">
            Are you sure you want to remove this {itemName}?
          </span>
          <span className="capitalize flex flex-row items-center gap-2">
            <span>{nameTobeDeleted}</span>
          </span>
          <div className="flex flex-row gap-6 items-center mt-10">
            <Button
              variant="outlined"
              className="text-black border-black"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              className="bg-red-700 border-red-700 hover:bg-red-700 hover:border-red-700 text-white"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteModal;
