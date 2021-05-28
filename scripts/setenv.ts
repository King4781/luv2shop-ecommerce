const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the context variable from netlify
const isProduction = process.env.CONTEXT === 'production';

if (!process.env.STRIPE_KEY) {
  console.error('All the required environment variables were not provided!');
  process.exit(-1);
}

const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

const API_URL = isProduction
  ? 'http://http://167.71.102.222:8080/spring-boot-ecommerce/api'
  : 'http://localhost:8080/api';
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   API_URL: "${API_URL}",
   STRIPE_KEY: "${process.env.STRIPE_KEY}"
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: any) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
