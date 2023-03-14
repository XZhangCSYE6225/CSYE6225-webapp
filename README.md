# webapp cloud


## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Mysql](https://dev.mysql.com/downloads/mysql/)
- [Packer](https://developer.hashicorp.com/packer/downloads)

## Language
- Node.js
- HCL
- Shell

## Tool
- Postman

## Dependencies
- express
- bcrypt
- mysql2
- jest
- supertest
- cors
- bagel
- @aws-sdk/client-s3
- multer

## Initialize Steps
1. Set up a workspace
```sh
cd ~/
mkdir -p ./workspace/csye6225
```
2. Clone the repo
```sh
git clone git@github.com:XZhangCSYE6225/webapp.git
```
3. Get into the directory of the repo
```sh
cd ./webapp
```
4. Install all dependencies
```sh
npm i
```
5. Run the app
```sh
nodemon server.js
```

## Create AMI
After PR is raised and pass both unit tests and validation tests, the branch is merged into main branch, meanwhile github actions will be triggered and will automatically create a new AMI using packer files in ```./packer/```. 
