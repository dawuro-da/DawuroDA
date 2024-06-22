export const afterReset = (props: {
  name: string;
}) => `<p>Dear ${props.name},</p>\n 
        <p>This email is to confirm that your password for the Gammoda Platform has been resetted.</p>\n
        <p>If you did not initiate this action, please recover access to your account by visiting our password reset page immediately.</p>\n
        <p>If you notice any suspicious activity, please contact our support team immediately for assistance.</p>\n 

        <p>Please note that we will never ask for your password via email and strongly discourage sharing it with anyone.</p>\n

        <p>If you have any questions or concerns, please do not hesitate to contact us at </p>\n 
        <p>gammoda@gmail.com.</p>\n\n
        <p>Gammoda team</p>\n

        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>`;

export const forgotPassword = (props: {
  name: string;
  token: string;
}) => `<p>Dear ${props.name},</p>\n 
                <p>We received a password reset request for your Gammoda admin account. If you did not initiate this action, please contact us immediately.</p>\n
                <p>To reset your password, click on the link below. Choose a strong and unique password.</p>\n 
                <p>Do not share your password with anyone and avoid using the same password for multiple accounts.</p>\n
                <p>Link: ${
                  process.env.NEXT_PUBLIC_HOSTNAME +
                  "/gaadmin/password-reset/" +
                  props.token
                }</p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us at </p>\n 
                <p>gammoda@gmail.com.</p>\n\n
                <p>Gammoda Team</p>\n
                
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>`;
