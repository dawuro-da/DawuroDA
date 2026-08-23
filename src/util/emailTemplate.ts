export const afterReset = (props: {
  name: string;
}) => `<p>Dear ${props.name},</p>\n 
        <p>This email is to confirm that your password for the DawuroDA Platform has been resetted.</p>\n
        <p>If you did not initiate this action, please recover access to your account by visiting our password reset page immediately.</p>\n
        <p>If you notice any suspicious activity, please contact our support team immediately for assistance.</p>\n 

        <p>Please note that we will never ask for your password via email and strongly discourage sharing it with anyone.</p>\n

        <p>If you have any questions or concerns, please do not hesitate to contact us at </p>\n
        <p>info@dawuroda.org.</p>\n\n
        <p>DawuroDA team</p>\n

        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>`;

export const forgotPassword = (props: {
  name: string;
  token: string;
}) => `<p>Dear ${props.name},</p>\n 
                <p>We received a password reset request for your DawuroDA admin account. If you did not initiate this action, please contact us immediately.</p>\n
                <p>To reset your password, click on the link below. Choose a strong and unique password.</p>\n 
                <p>Do not share your password with anyone and avoid using the same password for multiple accounts.</p>\n
                <p>Link: ${
                  process.env.NEXT_PUBLIC_HOSTNAME +
                  "/gaadmin/password-reset/" +
                  props.token
                }</p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us at </p>\n
                <p>info@dawuroda.org.</p>\n\n
                <p>DawuroDA Team</p>\n
                
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>\n 
                <p>&nbsp;</p>`;

export const RegisteredAsAdmin = (props: {
  name: string;
  role: string;
  email: string;
  password: string;
}) => `<p>Dear ${props.name},</p>\n 
    <p>This email is to notify you that you have been registered as ${props.role}. </p>\n
    <p>here the credentials to login to the system. and to be more secure please change your password by going to forgot password page on login.</p>\n
    
    <p>${props.email}</p>\n\n
    <p>${props.password}</p>\n
                
    <p>&nbsp;</p>\n 
    <p>&nbsp;</p>\n 
    <p>&nbsp;</p>\n 
    <p>&nbsp;</p>\n 
    <p>&nbsp;</p>`;

export const ConfirmationEmail = (props: {
  email: string;
  OTP: string;
}) => `<p>Dear User,</p>\n 
        <p>Here is your OTP confirmation code requested using ${props.email} email.</p>\n
        
        <p>${props.OTP}</p>\n\n
                    
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>\n 
        <p>&nbsp;</p>`;
