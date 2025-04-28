const mongoose = require('mongoose');


const { faker } = require('@faker-js/faker'); // Make sure you have faker-js installed

let createRandomStudent = (i) => {
  const gender = faker.helpers.arrayElement(['Male', 'Female']); // Define gender first

  return {
    name: faker.internet.username(),
    rollNo: i,
    age: faker.number.int({ min: 5, max: 18 }), // Generates a valid number
    gender: gender,
    address: faker.location.streetAddress(),
    fatherName: faker.person.fullName(),
    motherName: faker.person.fullName(),
    dateOfBirth: faker.date.past({ years: 10, refDate: new Date() }), // Generates a valid past date
    parentContact: faker.phone.number('+91##########'), // Generates a proper phone number
    grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
    image: gender === 'Male' 
    ? "https://cdn-icons-png.flaticon.com/512/3584/3584411.png" 
    : "https://cdn-icons-png.flaticon.com/512/2293/2293793.png",
    className: new mongoose.Types.ObjectId('67d69f190ed612c9f4dac6e8'), // Correct way to assign ObjectId
    
  };
};
let students=[];
for (let i=0;i<40;i++){
  students.push(createRandomStudent(i));
}

//console.log(students);
module.exports=students;
//console.log(students);
