module.exports = (sequelize, type) => {
  return sequelize.define('Course', {
    id: {
      type: type.UUID,
      defaultValue: type.UUIDV4,
      primaryKey: true,
    },
    title: { type: type.STRING, allowNull: false },
    course_code: {type: type.STRING, allowNull: false, unique: true},
    teacher_id: { type: type.STRING, allowNull: false } 
  })
};