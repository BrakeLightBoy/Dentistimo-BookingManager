const db = require('./db')
const userService = require('../services/user')
const dentistService = require('../services/dentist')
const User = require('../models/user')
const Dentist = require('../models/dentist')

const mongoose = require('mongoose')

//Before tests all the tests, creates and connects to a new test DB
beforeAll(async () => await db.connect());
//After each test, clear to database to give each test an empty DB
afterEach(async () => await db.clearDatabase());
//When all tests are done we delete the DB and close the connection to mongodb
afterAll(async () =>  await db.closeDatabase())

describe('Booking tests', () => {
    it('')
})