const Success = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center w-full justify-center">
      <div className="flex flex-col gap-1">
        <span className="text-5xl text-primaryColor tracking-tight font-black">
          Success
        </span>
        <br />
        <span className="tracking-tight text-titleColor">
          {`You've Successfully Registered.`}
          <br /> Please login and pay your contribuition
        </span>
      </div>
    </div>
  );
};

export default Success;
