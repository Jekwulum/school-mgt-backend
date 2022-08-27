module.exports = (sequelize, type) => {
  return sequelize.define('Grade', {
    id: {
      type: type.UUID,
      defaultValue: type.UUIDV4,
      primaryKey: true,
    },
    course_code: { type: type.STRING },
    student_id: { type: type.STRING, allowNull: false },
    score: { type: type.INTEGER, allowNull: false },
    grade: { type: type.STRING, allowNull: false }
  })
};