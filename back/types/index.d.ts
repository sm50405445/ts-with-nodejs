import UserModel from '../models/user'; // <- User class

declare module "express-serve-static-core" {
  interface Request {
    user?:UserModel;
  }
}

// declare global {
//   namespace Express {
//     export interface User extends UserModel { }
//     interface Request {
//       user?:UserModel
//     }
//   }
// }