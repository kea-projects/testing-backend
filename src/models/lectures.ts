import { Model, DataTypes, Sequelize } from "sequelize";
import { stringDateTime } from "../utils/input-validators";
import { Attendance } from "./attendances";
import { Subject } from "./subjects";

class Lecture extends Model {
  declare lectureId: number;
}

const lectureInit = (sequelize: Sequelize) => {
  Lecture.init(
    {
      lectureId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "lecture_id",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
        field: "started_at",
        set(value) {
          this.setDataValue("startedAt", stringDateTime(value));
        },
      },
      endedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("(NOW() + interval 90 minute)"), 
        field: "ended_at",
        set(value) {
          this.setDataValue("endedAt", stringDateTime(value));
        },
      },
    },
    {
      sequelize,
      tableName: "lectures",
    }
  );
};

const lectureAssociationInit = () => {
  Lecture.belongsTo(Subject, {
    foreignKey: {
      name: "subjectId",
      allowNull: false,
      field: "subject_id",
    },
  });

  Lecture.hasMany(Attendance, {
    foreignKey: {
      name: "lectureId",
      allowNull: false,
      field: "lecture_id",
    },
  });
};

export { Lecture, lectureInit, lectureAssociationInit };
