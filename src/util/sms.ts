import axios from "axios";

export const sendOTP = async ({ phone }: { phone: string }) => {
  const pr = "Here is your Gammoda sign up OTP";
  const response = await axios.get(
    `https://api.afromessage.com/api/challenge?sender=${process.env.AFRO_SENDER_NAME}&to=${phone}&ttl=300&pr=${pr}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.AFRO_AUTH_TOKEN,
      },
    }
  );
  console.warn(response.data.response)
  return response;
};
