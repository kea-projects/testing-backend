import { Model, DataTypes, Sequelize } from "sequelize";
import { stringDateTime } from "../utils/input-validators";
import { Lecture } from "./lectures";
import { User } from "./users";

class Attendance extends Model {}

const attendanceInit = (sequelize: Sequelize) => {
  Attendance.init(
    {
      attendanceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "attendance_id",
      },
      attendedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        field: "attended_at",
        set(value) {
          this.setDataValue("attendedAt", stringDateTime(value));
        },
      },
    },
    {
      sequelize,
      tableName: "attendances",
    }
  );
};

const attendanceAssociationInit = () => {
  Attendance.belongsTo(Lecture, {
    foreignKey: {
      name: "lectureId",
      allowNull: false,
      field: "lecture_id",
    },
  });

  Attendance.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
      field: "user_id",
    },
  });
};

export { Attendance, attendanceInit, attendanceAssociationInit };
