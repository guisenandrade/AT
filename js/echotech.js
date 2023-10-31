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
mongoose.connect('mongoose://127.0.0.1:27017/echotech',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 2000
});

//model Usuário
const UsuarioSchema = new mongoose.Schema({
    nomeCompleto : {type : String},
    email : {type : String},
    CPF : {type : String},
    celular : {type : String},
    senha : {type : String}
});

const Usuario = mongoose.model("Usuário", UsuarioSchema);

//roteamentos
app.post("/Login_vr4/singup", async(req, res)=>{
    const nomeCompleto = req.body.nome;
    const email = req.body.email;
    const CPF = req.body.CPF;
    const celular = req.body.celular;
    const senha = req.body.senha;

    if(nomeCompleto == null || email == null || CPF == null || celular == null || senha == null){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const emailExiste = await PermissionStatus.findOne({email:email})
    if(emailExiste){
        return res.status(400).json({error : "email já existe"})
    }

    const CPFExiste = await PermissionStatus.findOne({CPF:CPF})
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
    res.sendFile(__dirname + "/Login_v4/singup.html");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})