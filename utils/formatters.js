export const validateSignUpForm = (values) => {
  let valid = true;
  let tempErrors = {};

  // Destructuring values
  const {
    profileImage,
    firstName,
    lastName,
    phoneNumber,
    username,
    email,
    password,
    confirmPassword,
    role,
  } = values;

  if (!profileImage?.trim()) {
    tempErrors.profileImage = "Profile image is required";
    valid = false;
  }

  if (!firstName?.trim()) {
    tempErrors.firstName = "First Name is required";
    valid = false;
  }

  if (!lastName?.trim()) {
    tempErrors.lastName = "Last Name is required";
    valid = false;
  }

  if (!phoneNumber?.trim() || !/^\d+$/.test(phoneNumber)) {
    tempErrors.phoneNumber = "Enter a valid phone number";
    valid = false;
  }

  if (!username?.trim()) {
    tempErrors.username = "Username is required";
    valid = false;
  }

  if (!email?.trim() || !/\S+@\S+\.\S+/.test(email)) {
    tempErrors.email = "Enter a valid email address";
    valid = false;
  }

  if (!password?.trim()) {
    tempErrors.password = "Password is required";
    valid = false;
  } else if (password.length < 6) {
    tempErrors.password = "Password must be at least 6 characters";
    valid = false;
  }

  if (password !== confirmPassword) {
    tempErrors.confirmPassword = "Passwords do not match";
    valid = false;
  }

  if (!role) {
    tempErrors.role = "Please select a role";
    valid = false;
  }

  return { valid, errors: tempErrors };
};
