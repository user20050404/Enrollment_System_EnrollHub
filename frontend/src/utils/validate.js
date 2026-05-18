
export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+.[^@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
}

export function validateRegister(form) {
  const errors = {};
  if (!form.first_name.trim()) errors.first_name = 'First name is required.';
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+.[^@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/[A-Z]/.test(form.password)) errors.password = 'Password must contain at least one uppercase letter.';
  else if (!/[0-9]/.test(form.password)) errors.password = 'Password must contain at least one number.';
  if (!form.password2) errors.password2 = 'Please confirm your password.';
  else if (form.password !== form.password2) errors.password2 = 'Passwords do not match.';
  return errors;
}

export function validateStudent(form) {
  const errors = {};
  if (!form.student_id.trim()) errors.student_id = 'Student ID is required.';
  else if (!/^[A-Za-z0-9-]+$/.test(form.student_id)) errors.student_id = 'Student ID can only contain letters, numbers, and dashes.';
  if (!form.first_name.trim()) errors.first_name = 'First name is required.';
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+.[^@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.course.trim()) errors.course = 'Course is required.';
  if (!form.year_level) errors.year_level = 'Year level is required.';
  if (form.contact_number && !/^[0-9+\-\s]{7,15}$/.test(form.contact_number)) errors.contact_number = 'Enter a valid contact number.';
  return errors;
}

export function validateEnrollment({ student, section }) {
  const errors = {};
  if (!student) errors.student = 'Please select a student.';
  if (!section) errors.section = 'Please select a section.';
  return errors;
}
