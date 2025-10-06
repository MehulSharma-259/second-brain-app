import jwt from "jsonwebtoken"

export function verifyTokenUser(token :string) {
  return jwt.verify(token, process.env.JWT_SECRET_USER!)
}
export function verifyTokenAdmin(token :string) {
  return jwt.verify(token, process.env.JWT_SECRET_ADMIN!)
}
export function signTokenUser(payload :object) {
  return jwt.sign(payload, process.env.JWT_SECRET_USER!)
}
export function signTokenAdmin(payload :object) {
  return jwt.sign(payload, process.env.JWT_SECRET_ADMIN!)
}