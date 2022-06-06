import { Sequelize } from "sequelize";
import { userAssociationInit, userInit } from "../models/users";
import { subjectAssociationInit, subjectInit } from "../models/subjects";
import { Role, roleAssociationInit, roleInit } from "../models/roles";
import { exit } from "process";
import { lectureAssociationInit, lectureInit } from "../models/lectures";
import {
  attendanceAssociationInit,
  attendanceInit,
} from "../models/attendances";
import { classAssociationInit, classInit } from "../models/classes";
import { readFileSync } from "fs";
import path from "path";

/**
 * Creates or updates tables in the schema defined in the ENV `DATABASE`
 *
 * The schema MUST exist ahead of time or this will throw an error.
 */
const loadDB = async (sequelize: Sequelize) => {
  testDbConnection(sequelize).then(syncModels);
};

/**
 * Tries to connect to the database with the provided sequelize config.
 *
 * If an error occurs it will return null.
 *
 * @param sequelize An initialized Sequelize object with db connection
 *
 * @returns {Promise<Sequelize | null >}
 */
const testDbConnection = async (
  sequelize: Sequelize
): Promise<Sequelize | null> => {
  console.log("Attempting to connect to the database...");
  try {
    await sequelize.authenticate();
    console.log(`Successfully connected to the database`);
    return sequelize;
  } catch (e) {
    console.error(`Failed to connect to Database: ${e}`);
    return null;
  }
};

/**
 * Attempts to synchronize the local models with the database.
 *
 * It will only attempt to do so, if the parameter passed is of
 * type Sequelize, else it will skip it and exit.
 *
 * @param sequelize An initialized Sequelize object with db connection
 */
const syncModels = async (sequelize: Sequelize | null) => {
  if (sequelize) {
    try {
      console.log("Attempting to sync the models to the database...");

      loadModels(sequelize);
      loadAssociations();

      await sequelize.sync({ force: true }).then( async () => {
        populateDb(sequelize);
      });
      console.log("Database synced successfully ");
    } catch (e) {
      console.error(`Something went wrong while synchronizing the DB : ${e}`);
      // throw e
      exit(2);
    }
  } else {
    console.log("Skipping sync, db not connected");
    exit(1);
  }
};

/**
 * Initializes the models into sequelize
 * @param sequelize - Initialized sequelize instance
 */
const loadModels = (sequelize: Sequelize) => {
  roleInit(sequelize);
  userInit(sequelize);
  classInit(sequelize);
  subjectInit(sequelize);
  lectureInit(sequelize);
  attendanceInit(sequelize);
};

/**
 * Initializes the associations of the models in sequelize.
 *
 * Must be done after loading the models, or it fails as it does
 * not know about the models to which it needs to associate
 */
const loadAssociations = () => {
  roleAssociationInit();
  userAssociationInit();
  classAssociationInit();
  subjectAssociationInit();
  lectureAssociationInit();
  attendanceAssociationInit();
};

const populateDb = (sequelize: Sequelize) => {
  const pathToScript = path.resolve(
    __dirname,
    "../../docs/population-script.sql"
  );

  const populationScript = readFileSync(pathToScript, "utf-8");

  populationScript.split("\n").forEach((line) => {
    if (line.startsWith("INSERT")) {
      sequelize.query(line);
    }
  });
};
export { loadDB };
