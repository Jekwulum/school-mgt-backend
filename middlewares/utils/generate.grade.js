const gradeGenerator = (score) => {
  if (score > 100 || score < 0) grade = 'invalid';
  else if (score >= 70) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 45) grade = 'D';
  else if (score >= 40) grade = 'E';
  else if (score >= 0) grade = 'F';
  return grade;
};

module.exports = gradeGenerator;