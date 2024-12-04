const express = require('express')
const exphbs = require('express-handlebars')
const axios = require('axios')

const app=express()
const PORT=3002
const api_deputado_endpoint = 'https://dadosabertos.camara.leg.br/api/v2/deputados'


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.listen(PORT, ()=> console.log(`Servidor rodando em http://localhost:${PORT}`))
app.get('/', (req, res) =>{
    res.render("home")
})

app.get('/deputado', (req, res) =>{
    res.render("deputado")
})

app.get('/about', (req, res) => {
    res.render('about', {
        homeLink: '/'
    }); 
  });



app.post('/deputado', async(req, res)=>{

    const deputado=req.body.nomedep
    let id_deputado=''
    console.log(deputado)

    if(!deputado){
        return res.render('home', {error: "Insira o nome de um deputado"})
    }

    try{
        const response = await axios.get(
            api_deputado_endpoint+"?nome="+deputado+"&formato=json"
        )

        const deputadoData= response.data 
        id_deputado = deputadoData.dados[0].id
        console.log(id_deputado)
    

        const response_segunda_requisicao= await axios.get(

        api_deputado_endpoint+"/"+id_deputado+"?formato=json"

        
    )

    //Informacoes pessoais
        const deputadoData2= response_segunda_requisicao.data
        const deputadoInfo = {

            nome:deputadoData2.dados.ultimoStatus.nome,
            partido:deputadoData2.dados.ultimoStatus.siglaPartido,
            estado:deputadoData2.dados.ultimoStatus.siglaUf,
            situacao:deputadoData2.dados.ultimoStatus.situacao,
            condicaoEleitoral:deputadoData2.dados.ultimoStatus.condicaoEleitoral,
            urlFoto: deputadoData2.dados.ultimoStatus.urlFoto,
            dataNascimento:deputadoData2.dados.dataNascimento,
            escolaridade:deputadoData2.dados.escolaridade

        
        }

        console.log(deputadoInfo)
        res.render('deputado', {deputadoInfo})
    }

    catch(error){

        res.render('deputado', {error: 'Deputado não encontrado'})

    }
})