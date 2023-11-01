//instalando programar auxiliares
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
const port = 3000;

//acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/echotech',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 2000
});

//model Usuário
const UsuarioSchema = new mongoose.Schema({
    nomeCompleto : {type : String},
    email : {type : String},
    cpf : {type : String},
    celular : {type : String},
    senha : {type : String}
});

const Usuario = mongoose.model("Usuário", UsuarioSchema);

//roteamentos
app.post("/singup", async(req, res)=>{
    const nomeCompleto = req.body.nomeCompleto;
    const email = req.body.email;
    const CPF = req.body.cpf;
    const celular = req.body.celular;
    const senha = req.body.senha;

    if(nomeCompleto == null || email == null || CPF == null || celular == null || senha == null){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const emailExiste = await Usuario.findOne({email:email})
    if(emailExiste){
        return res.status(400).json({error : "email já existe"})
    }

    const CPFExiste = await Usuario.findOne({CPF:CPF})
    if(CPFExiste){
        return res.status(400).json({error : "CPF já existe"})
    }

    const usuario = new Usuario({
        nomeCompleto : nomeCompleto,
        email : email,
        CPF : CPF,
        celular : celular,
        senha : senha
    });

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro OK", usuarioID : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//get de cadastro
app.get("/singup", async (req, res)=>{
    res.sendFile(__dirname + "/singup");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})