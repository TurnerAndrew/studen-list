const express = require('express')
const path = require('path')
const app = express()

app.use(express.json())

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: 'ec94cd4d11354e56b69b9feb7e717751',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

app.get('/', (req, res) => {
    rollbar.info('Someone loaded the page.')
    res.sendFile(path.join(__dirname, './index.html'))
})

const students = ['Andrew', 'Jeddy', 'Eric']

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
    const {name} = req.body

    const index = students.findIndex(student => {
        return student === name
    })

    try {
        if(index === -1 && name !== ''){
            students.push(name)
            rollbar.info('Someone added a student')
            res.status(200).send(students)
        } else if (name === 'blank') {
            res.status(400).send('Must enter a name')
        } else if (index > -1) {
            res.status(400).send('That student exists.')
        }
    } catch (err) {
        console.log(err)
        rollbar.error(`${err} occurred in the post request`)
    }

})

app.delete('/api/students/:index', (req, res) => {
    const index = +req.params.index

    students.splice(index, 1)
    rollbar.info('Someone deleted a student')

    res.status(200).send(students)
})



const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Port listening on ${port}`))