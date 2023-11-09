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
});

//model de login
const LoginSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : {type : String}
});

const Login = mongoose.model("Login", LoginSchema);

//roteamentos
app.post("/Login_v4/signin", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

    if( email == '' || senha == ''){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const emailExiste = await Login.findOne({email:email})
    if(emailExiste){
        return res.status(400).json({error : "email já existe"})
    }

    const login = new Login({
        email : email,
        senha : senha
    });

    try{
        const newLogin = await login.save();
        res.json({error : null, msg : "Login feito com sucesso", loginID : newLogin._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//model cadastro
const CadastroSchema = new mongoose.Schema({
    nomeCompleto : {type : String},
    email : {type : String},
    cpf : {type : String},
    celular : {type : String},
    senha : {type : String}
});

const Cadastro = mongoose.model("Cadastro", CadastroSchema);

//roteamentos
app.post("/signup", async(req, res)=>{
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
        const newCadastro = await cadastro.save();
        res.json({error : null, msg : "Você foi cadastrado com sucesso", cadastroID : newCadastro._id});
    } catch(error){
        res.status(400).json({error});
    }
});

//model de contato
const ContatoSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required : true},
    duvida : {type : String}
});

const Contato = mongoose.model("Contato", ContatoSchema);

// roteamento de contato
app.post("/contact", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const duvida = req.body.duvida;

    if(nome == '' || email == '' || duvida == ''){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const contato = new Contato({
        nome : nome,
        email : email,
        duvida : duvida
    });

    try{
        const newContato = await contato.save();
        res.json({error : null, msg : "Sua dúvida foi salva iremos analisar e responde-lo em seu e-mail", contatoID : newContato._id});
    } catch(error){
        res.status(400).json({error});
    }
});


// get de login
app.get("/Login_v4/signin", async (req, res)=>{
    res.sendFile(__dirname + "/Login_v4/signin.html");
})

//get de cadastro
app.get("/Login_v4/signup", async (req, res)=>{
    res.sendFile(__dirname + "/Login_v4/signup.html");
})

// get de contato
app.get("/contact", async (req, res)=>{
    res.sendFile(__dirname + "/contact.html");
})

// get de contato
app.get("/about", async (req, res)=>{
    res.sendFile(__dirname + "/about.html");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})
