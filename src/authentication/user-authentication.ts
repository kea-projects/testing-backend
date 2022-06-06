import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { TEACHER_ROLE_ID } from "../config/constants";
import { Role } from "../models/roles";
import { User } from "../models/users";

/**
 * Checks if user is authenticated
 * - If yes: go to next()
 * - If no: redirect to /auth/login
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).send({ error: 403, message: "Not authorized" });
};

export const teacherGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if((req.user?.roleId)?.toString() === TEACHER_ROLE_ID) {
    return next();
  } else {
    return res.status(403).send({ status: 403, message: "Not authorized" });
  }
};

/**
 * Microsoft sends us user details during the authentication process
 * - Save user into our database
 * @param _accessToken
 * @param _refreshToken
 * @param profile user profile from microsoft
 * @param done
 * @returns confirmation to microsoft that it was successful or that we got an error
 */
export const microsoftUser = async (
  _accessToken: any,
  _refreshToken: any,
  profile: any,
  done: any
) => {
  const email = profile._json.mail;
  const roleName = getRoleName(email);

  // If not valid, sends null values back, which will fail the login
  if (roleName === "not-valid") {
    done(null, null);
  }

  const user = await User.findOne({ where: { email: email } });
  const role = await Role.findOne({ where: { name: roleName } });
  if (user) {
    done(null, user);
  } else {
    const newUser = User.build({
      name: profile.displayName,
      email: email,
      roleId: role?.roleId,
    });
    const savedUser = await newUser.save();
    done(null, savedUser);
  }
};

/**
 * Handles authentication of users with session and cookies
 */
export const userAuthentication = {
  /**
   * Called during the authentication with the third party auth service
   * - Saves user.id in the session
   * - Saves user.id in client cookie
   */
  serialize: (): void => {
    passport.serializeUser((user, done) => {
      done(null, user.userId);
    });
  },
  /**
   * Called in every request from the client
   * - gets id extracted from express session and passes it to this function
   * - checks if user exists in our database
   * - - if so, creates new user object saved as req.user
   * - - - Fields: userId, name, email, roleName
   * - - if not, uses null value in done method : invalid user
   */
  deserialize: (): void => {
    passport.deserializeUser(async (id: any, done) => {
      const user = await User.findByPk(id);
      if (user) {
        const sessionUser = {
          userId: user?.getDataValue("userId"),
          name: user?.getDataValue("name"),
          email: user?.getDataValue("email"),
          roleId: user?.getDataValue("roleId"),
        };

        done(null, sessionUser);
        return;
      }
      done(null, user);
    });
  },
};

/**
 * Checks that the email address is valid : teacher or student.
 * @param email email we get from the third party auth service
 * @returns student, or teacher, or not-valid
 */
function getRoleName(email: string) {
  const suffix = email.split("@")[1];
  switch (suffix) {
    case "stud.kea.dk":
      return "student";
    case "kea.dk":
      return "teacher";
    default:
      return "not-valid";
  }
}
