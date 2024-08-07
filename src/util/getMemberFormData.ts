export const getMemberFormData = (values: any) => {
  const formData = new FormData();

  formData.append("hasPaid", values.hasPaid);
  formData.append("firstName", values.firstName);
  formData.append("lastName", values.lastName);
  formData.append("country", values.country);
  formData.append("nationality", values.nationality);
  formData.append("institutionName", values.institutionName);
  formData.append("headOrRepresentative", values.headOrRepresentative);
  formData.append("fieldOfWork", values.fieldOfWork);
  formData.append("partnershipIdea", values.partnershipIdea);
  formData.append("phone", values.phone);
  formData.append("email", values.email);
  formData.append("gender", values.gender);
  formData.append("dateOfBirth", values.dateOfBirth);
  formData.append("region", values.region);
  formData.append("zone", values.zone);
  formData.append("city", values.city);
  formData.append("kebele", values.kebele);
  formData.append("workPlace", values.workPlace);
  formData.append("idNumber", values.idNumber);
  formData.append("branch", values.branch);
  formData.append(
    "profileImage",
    typeof values.profileImage === "string"
      ? values.profileImage
      : values.profileImage?.[0]
  );
  formData.append("membershipLevel", values.membershipLevel);
  formData.append("contributionSystem", values.contributionSystem);
  formData.append("educationLevel", values.educationLevel);
  formData.append("contributionAmount", values.contributionAmount);
  formData.append("expertise", values.expertise);
  formData.append("positionAtWork", values.positionAtWork);
  formData.append("paymentMeans", values.paymentMeans);
  formData.append("membershipType", values.membershipType);
  formData.append("password", values.password);

  return formData;
};
