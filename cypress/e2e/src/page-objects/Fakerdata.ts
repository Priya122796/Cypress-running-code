import {faker} from '@faker-js/faker';


const generateData = () => {
  return {
    id: faker.random.numeric(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    client_name:faker.name.fullName(),
    email: faker.internet.email(),
    mobile_number: faker.phone.number('501#######'),
   // subject : faker.lorem.sentence(),
    dob: faker.date.between('1999/01/01', '2023/06/19'),
     //between(from: '1950/01/01', to: '2001/12/31').strftime("%d/%m/%Y")
   // It will return "29/05/1969"
    address : (faker.address.secondaryAddress()),
    street : faker.address.street(),
    state : faker.address.countryCode('alpha-2'),
    city : faker.address.city(),
    zip : faker.address.zipCode('#####'),
    ext : faker.phone.number('##'),
    website : faker.internet.url()
  };
  
};

export const generateEmployees = (numUsers) => {
  cy.log("Printing inside fakeradta "+ numUsers)
  return Array.from({ length: numUsers }, generateData);
};

//let dataObj = generateEmployees(10);
//fs.writeFileSync('data.json', JSON.stringify(dataObj, null, '\t'));