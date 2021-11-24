const express = require('express')
const path = require('path')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
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

    if(index === -1 && name !== ''){
        students.push(name)
        res.status(200).send(students)
    } else if (name === 'blank') {
        res.status(400).send('Must enter a name')
    } else if (index > -1) {
        res.status(400).send('That student exists.')
    }

})

app.delete('/api/students/:index', (req, res) => {
    const index = +req.params.index

    students.splice(index, 1)

    res.status(200).send(students)
})



const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Port listening on ${port}`))