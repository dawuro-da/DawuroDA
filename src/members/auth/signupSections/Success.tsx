import { Button } from "@mui/material";

const Success = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center w-full justify-center">
      <div className="flex flex-col gap-1">
        <span className="text-5xl text-primaryColor tracking-tight font-black">
          Success
        </span>
        <br />
        <span className="tracking-tight text-[rgb(0,0,0,0.7)]">
          {`You've Successfully Registered.`}
          <br /> Please pay your contribuition amount.
          <br /> Click here if you are not redirected to payment link.
          <br />
        </span>
        <Button variant="contained" size="small" className="min-w-[200px] mt-6">
          Pay
        </Button>
      </div>
    </div>
  );
};

export default Success;
