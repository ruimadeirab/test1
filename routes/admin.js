const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require ("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/',(req,res)=>{
    res.render("admin/index")
})

router.get('/posts', (req,res)=>{
    res.send('pagina de Posts')
})

router.get('/categorias', (req,res)=>{
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro ao descarregar as categorias")
        res.redirect("/admin")
    })
    
   // res.render('admin/categorias')
})
router.get('/categorias/add', (req,res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req,res)=>{
   var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome==null){
        erros.push({texto: 'nome invalido'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug==null){
        erros.push({texto: 'slug invalido'})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome demasiado curto'})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg","categoria registada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","houve um erro ao salvar a categoria")
            console.log("erro ao salvar categoria")
            res.redirect("/admin")
        })
    }

    /*const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        console.log("categoria guardada")
    }).catch((err)=>{
        console.log("erro")
    })*/
})

router.get("/categorias/edit/:id", (req,res)=>{
    //res.send("isto é a pag de edição de categorias!")
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "esta categoria nao existe")
        res.redirect("/admin/categorias")
    })
    // res.render("admin/editcategorias")
})

router.post("/categorias/edit" , (req,res) =>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        categoria.nome=req.body.nome
        categoria.slug=req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", "categoria editada")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "houve um erro interno ao editar")
            res.redirect("/admin/categorias")
        })

    }).catch((err)=>{
        req.flash("error_msg", "houve um erro na edição")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/apagar", (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "categoria apagada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro ao apagar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", (req,res)=>{
    res.render("admin/postagens")
})
router.get("/postagens/add", (req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro ao carregar form")
        res.redirect("/admin")
    })
    
    //res.render("admin/addpostagem")
})

router.post("/postagens/nova", (req,res)=>{
    var erros=[]

    if(req.body.categoria=="0"){
        erros.push({text: "categoria invalida, registe uma categoria"})
    }
})
/*router.get('/teste', (req,res)=>{
    res.send('isto e um teste')
})*/

module.exports = router