const express = require('express')
const app = express()
app.use(express.json()) 

const morgan = require('morgan');
app.use(morgan('tiny'))

// definig custom token for morgan to log a request body
morgan.token('body', (req) => JSON.stringify(req.body));
// use it as a middleware
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
); // what to be shown

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

const countinfo  = () =>{
    const currenttime = new Date()
    return(
         `<p>Phonebook has info for ${persons.length} people </p>
         <p>${currenttime.toString()}</p>`
    )
}

app.get('/api/info', (req, res) =>{
    res.send(countinfo())
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id 
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }

})


app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id 
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})



const generateid = () => {
    if(persons.length === 0){
        return 1
    }
    else{
    const newid = Math.max(...persons.map(p => Number(p.id)))
    return newid+1
    }
}

app.post('/api/persons', (req, res) =>{
    const body = req.body 
    if(!body.name || !body.number){
        return res.status(400).json({
            error : 'content missing'
        })
    }
    if(persons.some(p => p.name === body.name)){
        return res.status(400).json({
            error : 'name must be unique'
        })
    }

    const new_person ={
        name : body.name, 
        number : body.number || false,
        id : generateid()
    }

    persons = persons.concat(new_person)
    res.json(persons)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})