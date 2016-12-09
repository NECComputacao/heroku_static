meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
var hoje = new Date();                                      // Data no formato js (atual)
var hoje_dia = hoje.getDate();                              // Dia (atual)
var hoje_mes_string = meses[hoje.getMonth()];               // Nome do mes (atual)
var hoje_mes_numero = hoje.getMonth()+1;                    // Nº do mes (atual)
var hoje_ano = hoje.getFullYear();                          // Ano (atual)
var data_atual = hoje_dia+"/"+hoje_mes_numero+"/"+hoje_ano; // Data atual no formato dd/mm/aaaa
var ano_calendario = hoje_ano;
var mes_calendario = hoje_mes_numero;
var dia_calendario = hoje_dia;
var dias_actividades_mes_atual = [];

function mounth_change(opt){
    var caixa = document.getElementById("mes_atual");
    var atual = meses.indexOf(caixa.textContent);
    if(opt == 'a') atual -= 1;
    if(opt == 'p') atual += 1;
    if(atual > 11){
        atual = 0;
        ano_calendario += 1;
    }
    if(atual < 0){ 
        atual = 11;
        ano_calendario -= 1;
    }
    
    mes_calendario = atual+1;
    
    var dbAPI = "http://localhost:8000/" + mes_calendario + "-" + ano_calendario + "/";
    $.getJSON( dbAPI ).done(function( dados ) {
        dias_actividades_mes_atual =[].concat.apply([], dados);
        getDaysArray(ano_calendario, atual+1);
    });
    
    caixa.textContent = meses[atual];
    muda_data_atual_aux( dia_calendario + "/" + (atual+1) + "/" + ano_calendario );
}

function init_calendario(){
    document.getElementById("data_Atual").textContent = data_atual;
    document.getElementById("mes_atual").textContent = hoje_mes_string;
    
    var dbAPI = "http://localhost:8000/" + mes_calendario + "-" + ano_calendario + "/";
    $.getJSON( dbAPI ).done(function( dados ) {
        //dias_actividades_mes_atual = dados;
        dias_actividades_mes_atual =[].concat.apply([], dados);
        getDaysArray(hoje_ano, hoje_mes_numero);
    });
    
    muda_data_atual_aux(data_atual);
}

function getDaysArray(year, month) {
    var date = new Date(year, month-1, 1);
    var getDaysInMonth = new Date(year, month, 0).getDate();
    var start = date.getDay();
    var aux;
    switch(start) {
        case 0:
            aux = 7;
            break;
        default:
            aux = start;
    }
    
    for(var i=1, d=1; i <= 42; i++){
        var element = document.getElementById("cal_dia_" + i);
        element.innerHTML = "";
        if(i >= aux && d <= getDaysInMonth){
            if(d == hoje_dia && month == hoje_mes_numero && year == hoje_ano){
                element.classList = "cal_dia_atual cal_dia waves-effect waves-light";
                element.style.color = "#ffffff !important";
            }else{
                element.classList = "cal_dia waves-effect waves-light";
                element.style.color = "#333333 !important";
            }
            
            if($.inArray(d, dias_actividades_mes_atual) >= 0){
                element.innerHTML = "<p class='blue-text' id='celula_" + i + "'>" + d + "</p>";
            }else{
                element.innerHTML = "<p class='' id='celula_" + i + "'>" + d + "</p>";
            }
            d++;
        }else{
            element.textContent = " ";
            element.className = '';
        }
    }
    
    return true;
}

function muda_data_atual(divi){
    dia_calendario = document.getElementById("celula_"+divi).textContent;
    dataaa = dia_calendario;
    dataaa += '/';
    dataaa += mes_calendario;
    dataaa += '/';
    dataaa += ano_calendario;
    muda_data_atual_aux(dataaa);
}
//var imagem = null;
function muda_data_atual_aux(ddaattaa){
    document.getElementById("data_Atual").textContent = ddaattaa;
    $.getJSON("http://localhost:8000/" + ddaattaa.split('/').reverse().join('-') + '/', function(dadoss){
        var n = dadoss.length;
        dados_act = document.getElementById("dados_atividades");
        dados_act.innerHTML = ""; 
        console.log(dadoss);
        console.log(n);
        if(n){
            for(var i=0, k=i; i<n; i++){
                var dados = dadoss[i];
                if(dados.success == undefined){
                    dados_act.innerHTML += "<a href='#!' onclick='display_info(" + k + "," + n +")' class='link_act'><p class='white-text'>" + dados.tipo + "<i class='material-icons right'>add</i>" +"</p></a>";
                    dados_act.innerHTML += "<div class='separador-fino'></div>";
                    dados_act.innerHTML += "<div id='dados_atividades_conteudo_" + k + "' class='dados_atividades_conteudo' style='display: none !important;'></div>" ;
                    if(i < n-1){
                        dados_act.innerHTML += "<br>";
                    }
                    var tipo = dados.tipo;
                    var dados_act_info = document.getElementById("dados_atividades_conteudo_" + k);
                    dados_act_info.innerHTML = "<h6 class='white-text center'><b>" + dados.titulo + "</b></h6>";
                    if(tipo == 'Workshop'){
                        if(dados.orador != 'vazio'){
                            dados_act_info.innerHTML += "<p class='white-text'><b>Orador:</b> " + dados.orador + "</p>";
                        }else{
                            dados_act_info.innerHTML += "<p class='white-text'>Orador por confirmar</p>";
                        }
                    }
                    if(dados.local != 'vazio') dados_act_info.innerHTML += "<p class='white-text'><b>Local:</b> " + dados.local + "</p>";
                    if(dados.hora != '00:00') dados_act_info.innerHTML += "<p class='white-text'><b>Hora:</b> " + dados.hora + "</p>";
                    dados_act_info.innerHTML += "<p class='white-text'>Sabe mais <b><a href='" + dados.link_atividade + "' target='_blank'> aqui</a></b></p>";

                    //console.log(dados[i]);
                    k++;
                    
                }else{
                    dados_act.innerHTML = "";
                    if( Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600){
                        document.getElementById("actividade_inner").className = 'col s12';
                        document.getElementById("actividade_bg").style.background = "";
                        document.getElementById("actividade_bg").style.backgroundSize = "cover";
                    }
                }
            }
        }else{
            if(dadoss.success == undefined){
                dados_act.innerHTML += "<a href='#!' onclick='display_info(0,0)' class='link_act'><p class='white-text'>" + dadoss.tipo +  "<i class='material-icons right'>add</i>" +"</p></a>";
                dados_act.innerHTML += "<div class='separador-fino'></div>";
                dados_act.innerHTML += "<div id='dados_atividades_conteudo_0' class='dados_atividades_conteudo' style='display: none !important;'></div>" ;
                var tipo = dadoss.tipo;
                var dados_act_info = document.getElementById("dados_atividades_conteudo_0");
                dados_act_info.innerHTML = "<h6 class='white-text center'><b>" + dadoss.titulo + "</b></h6>";
                if(tipo == 'Workshop'){
                    if(dadoss.orador != 'vazio'){
                        dados_act_info.innerHTML += "<p class='white-text'><b>Orador:</b> " + dadoss.orador + "</p>";
                    }else{
                        dados_act_info.innerHTML += "<p class='white-text'>Orador por confirmar</p>";
                    }
                }
                if(dadoss.local != 'vazio') dados_act_info.innerHTML += "<p class='white-text'><b>Local:</b> " + dadoss.local + "</p>";
                if(dadoss.hora != '00:00') dados_act_info.innerHTML += "<p class='white-text'><b>Hora:</b> " + dadoss.hora + "</p>";
                dados_act_info.innerHTML += "<p class='white-text'>Sabe mais <b><a href='" + dadoss.link_atividade + "' target='_blank'> aqui</a></b></p>";

                //console.log(dados[i]);
                i++;
            }else{
                dados_act.innerHTML = "";
                if( Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600){
                    document.getElementById("actividade_inner").className = 'col s12';
                    document.getElementById("actividade_bg").style.background = "";
                    document.getElementById("actividade_bg").style.backgroundSize = "cover";
                }
            }
        }
    });
}

function display_info(v, l){
    for(var i=0; i<l; i++){
        if(i != v){
            if(document.getElementById("dados_atividades_conteudo_" + i).style.display != "none"){
                $("#dados_atividades_conteudo_" + i).slideToggle( "slow" );
            }
        }else{
            $("#dados_atividades_conteudo_" + v).slideToggle( "slow" );
        }
    }
    if(l == 0){
         $("#dados_atividades_conteudo_0").slideToggle( "slow" );
    }
    //$("#actividade_inner").css("background-image", "url(" + imagem + ")"); 
}