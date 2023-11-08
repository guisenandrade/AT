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
    email : {type : String},
    senha : {type : String}
});

const Usuario = mongoose.model("Usuário", UsuarioSchema);

//roteamentos
app.post("/singin", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

    if( email == '' || senha == ''){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const emailExiste = await Usuario.findOne({email:email})
    if(emailExiste){
        return res.status(400).json({error : "email já existe"})
    }


    const usuario = new Usuario({
        email : email,
        senha : senha
    });

    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro OK", usuarioID : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//model Usuário
const CadastroSchema = new mongoose.Schema({
    nomeCompleto : {type : String},
    email : {type : String},
    cpf : {type : String},
    celular : {type : String},
    senha : {type : String}
});

const Cadastro = mongoose.model("Cadastro", CadastroSchema);

//roteamentos
app.post("/singup", async(req, res)=>{
    const nomeCompleto = req.body.nomeCompleto;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const celular = req.body.celular;
    const senha = req.body.senha;

    if(nomeCompleto == null || email == null || cpf == null || celular == null || senha == null){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const emailExiste = await Cadastro.findOne({email:email})
    if(emailExiste){
        return res.status(400).json({error : "email já existe"})
    }

    const CPFExiste = await Cadastro.findOne({cpf:cpf})
    if(CPFExiste){
        return res.status(400).json({error : "CPF já existe"})
    }

    const cadastro = new Cadastro({
        nomeCompleto : nomeCompleto,
        email : email,
        cpf : cpf,
        celular : celular,
        senha : senha
    });

    try{
        const newUsuario = await cadastro.save();
        res.json({error : null, msg : "Cadastro OK", usuarioID : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//get de cadastro
app.get("/singin", async (req, res)=>{
    res.sendFile(__dirname + "./Login_v4/singin.html");
})

app.get("/singup", async (req, res)=>{
    res.sendFile(__dirname + "./Login_v4/singup.html");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})
