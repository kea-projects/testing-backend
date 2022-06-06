import { Model, DataTypes, Sequelize } from "sequelize";
import { User } from "./users";
import { Lecture } from "./lectures";
import { Class } from "./classes";

class Subject extends Model {
  declare subjectId: number;
}

const subjectInit = (sequelize: Sequelize) => {
  Subject.init(
    {
      subjectId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "subject_id",
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "subjects",
    }
  );
};

const subjectAssociationInit = () => {
  Subject.hasMany(Lecture, {
    foreignKey: {
      name: "subjectId",
      allowNull: false,
      field: "subject_id",
    },
  });

  Subject.belongsTo(User, {
    foreignKey: {
      name: "teacherUserId",
      allowNull: false,
      field: "teacher_user_id",
    },
  });

  Subject.belongsTo(Class, {
    foreignKey: {
      name: "classId",
      allowNull: false,
      field: "class_id",
    }
  })
};

export { Subject, subjectInit, subjectAssociationInit };
