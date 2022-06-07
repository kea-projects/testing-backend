import { Model, DataTypes, Sequelize } from "sequelize";
import { Subject } from "./subjects";


class Class extends Model {
  declare classId: number;
}

const classInit = (sequelize: Sequelize) => {
  Class.init(
    {
      classId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "class_id",
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "classes",
    }
  );
};

const classAssociationInit = () => {
  Class.hasMany(Subject, {
    foreignKey: {
      name: "classId",
      allowNull: false,
      field: "class_id",
    },
  });
};

export { Class as Class, classInit as classInit, classAssociationInit as classAssociationInit };
