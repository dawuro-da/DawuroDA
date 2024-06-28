import CountdownTimer from "./CountdownTimer";

const WhatsHappening = () => {
  return (
    <div className="md:py-24 py-12">
      <h2 className="font-bold md:w-full w-4/5 mx-auto lg:text-4xl md:text-2xl text-xl mb-6">
        What's Happening Next: Key Events
      </h2>
      <p className="md:mb-20 mb-10 font-light lg:w-[23%] mx-auto text-center">
        Don't Miss These Exciting Events
      </p>
      <div className="w-4/5 space-y-10 mx-auto grid md:grid-cols-4 bg-gradient-to-b from-blue-100 to-white px-14 xl:lg:px-14 md:px-0 py-20 border border-[#13A6D9]">
        <div className="text-[#000000] md:text-left text-center lg:max-w-full max-w-[80%] mx-auto items-center flex justify-center">
          <h2 className="text-sm font-normal md:max-w-[50%]">
            Gamo Development Association Annual Summit 2024
          </h2>
        </div>
        <div className="text-center">
          <p className="md:text-5xl text-xl font-bold mb-2">15-7</p>
          <p className="text-lg font-light">June</p>
        </div>
        <div className="text-center md:max-w-[70%]">
          <p className="text-xl font-bold mb-2">Arbamich, Paradise Hotel</p>
          <p className="text-lg font-light">Venue</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold mb-2">9:00 AM - 5:00 PM</p>
          <p className="text-lg font-light">Time</p>
        </div>
      </div>
      <CountdownTimer />
    </div>
  );
};

export default WhatsHappening;
