import {faker} from '@faker-js/faker';


const generateData = () => {
  return {
    id: faker.random.numeric(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    mobile_number: faker.phone.number('501#######'),
   // subject : faker.lorem.sentence(),
    dob: faker.date.between('1950/01/01', '2023/12/31'),
     //between(from: '1950/01/01', to: '2001/12/31').strftime("%d/%m/%Y")
   // It will return "29/05/1969"
    address : (faker.address.secondaryAddress()),
    state : faker.address.state()
  };
  
};

export const generateEmployees = (numUsers) => {
  cy.log("Printing inside fakeradta "+ numUsers)
  return Array.from({ length: numUsers }, generateData);
};

//let dataObj = generateEmployees(10);
//fs.writeFileSync('data.json', JSON.stringify(dataObj, null, '\t'));