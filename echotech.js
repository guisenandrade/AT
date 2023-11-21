//instalando programar auxiliares
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.use(express.static('public'))
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

//model de servico
const ServicoSchema = new mongoose.Schema({
    nome : {type : String, required : true},
    email : {type : String},
    celular : {type : String},
    cpf : {type : String, required : true},
    cep : {type : String, required : true},
    logradouro : {type : String, required : true},
    bairro : {type : String, required : true},
    numero : {type : Number, required : true},
    complemento : {type : String},
    referencia : {type : String},
    cidade : {type : String, required : true},
    uf : {type : String, required : true}
});

const Servico = mongoose.model("Servico", ServicoSchema);

// roteamento de contato
app.post("/servico", async(req, res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const celular = req.body.celular
    const cpf = req.body.cpf
    const cep = req.body.cep
    const logradouro = req.body.logradouro
    const bairro = req.body.bairro
    const numero = req.body.numero
    const complemento = req.body.complemento
    const referencia = req.body.referencia
    const cidade = req.body.cidade
    const uf = req.body.uf

    if(nome == '' || email == '' || celular == '' || cpf == '' || cep == '' || logradouro == '' || bairro == '' || numero == '' || cidade == '' || uf == ''){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const servico = new Servico({
         nome : nome,
         email : email,
         celular : celular,
         cpf : cpf,
         cep : cep,
         logradouro : logradouro,
         bairro : bairro,
         numero : numero,
         complemento : complemento,
         referencia : referencia,
         cidade : cidade,
         uf : uf
    });

    try{
        const newServico = await servico.save();
        res.json({error : null, msg : "Seu serviço foi cadastrado, enviaremos um email para que possamos encontrar um dia para instalação do SolAir", servicoID : newServico._id});
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

// get de about
app.get("/about", async (req, res)=>{
    res.sendFile(__dirname + "/about.html");
})

// get de servico
app.get("/servico", async (req, res)=>{
    res.sendFile(__dirname + "/servico.html");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})
