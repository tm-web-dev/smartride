import bcrypt from "bcryptjs";

/**
 * Hash a plain text password
 * @param password - user input password
 * @returns hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; 
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/**
 * Compare plain password with hashed password
 * @param password - user input password
 * @param hashedPassword - stored hashed password
 * @returns boolean (true if match)
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}