import { Model, DataTypes, Sequelize } from "sequelize";
import { Attendance } from "./attendances";
import { Subject } from "./subjects";
import { Role } from "./roles";

class User extends Model {
  declare userId?: number;
}

const userInit = (sequelize: Sequelize) => {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "user_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    },
    {
      sequelize,
      tableName: "users",
    }
  );
};

const userAssociationInit = () => {
  User.belongsTo(Role, {
    foreignKey: {
      name: "roleId",
      allowNull: false,
      field: "role_id",
    },
  });

  User.hasMany(Subject, {
    foreignKey: {
      name: "teacherUserId",
      allowNull: false,
      field: "teacher_user_id",
    },
  });

  User.hasMany(Attendance, {
    foreignKey: {
      name: "userId",
      allowNull: false,
      field: "user_id",
    },
  });
};

export { User, userInit, userAssociationInit };
