$(document).ready(function () {
    var brands = new Map([
        ["Crizal Alize" , {
            logo : "img/essilor_sg.png",
            title : "qwertyui",
            icons : []
        }]
    ]);
    var combinations = [
        {
            no: [{
                name: "vision-challenge", val: "kids"
            }],
            yes: [],
            more: [],
            less: [{
                name: "in-comp", val: 3
            }],
            value: "Crizal Alize"
        },
        {
            no: [],
            yes: [{
                name: "vision-challenge", val: "kids"
            }],
            more: [{
                name: "in-comp", val: 3
            }],
            less: [],
            value: "Singe vision"
        },
      
    ]
        
    var template = function(logo, title, icons){
        let iconsFlex = "";
        icons.forEach(icon => {
            iconsFlex+='<img src="'+icon+'" alt="">';
        });
        return '<div class="brand-template"><div class="brand-template__logo"><img src="'+logo+'" alt=""></div><div class="brand-template__tite">'+title+'</div><div class="brand-template__icons">'+iconsFlex+'</div></div>';
    }


    $("#mainpage_button").on("click", function(){
        $(".questions").removeClass("hidden")
        $(".js-lens-builder__start-screen").addClass("hidden")
    })

    $(".twentytwenty-handle").on("mouseleave", function(event){
        // console.log($(this).css("left").replace(/[a-z]/gi, '') / $("#filter-image-wrapper").width())
        $(this).parent().find(".real-val").text($(this).css("left").replace(/[a-z]/gi, '') / $("#filter-image-wrapper").width());
    })

    $( "#timer-range").slider({
        animate: "slow",
        min: 0,
        max: 12,    
        value: 4
    });

    $( "#timer-range" ).slider({
        slide : function( event, ui ) {
            $(".circle").html(ui.value);
            $(".num").html("<strong>"+ui.value+ "</strong><small> ЧАСОВ</small>");
            Circle(".circle", ui.value);   
            $(".time-slider").find(".real-val").text(ui.value);
         }
    });

    var Circle = function(sel, val){
        var el = document.querySelector(sel);
            var valEl = parseFloat(el.innerHTML);
            
            valEl = val*526/12 +1 ;

            el.innerHTML = ' <svg width="178" height="178"><circle transform="rotate(-90)" style="stroke-dasharray:'+valEl+'px 526px;" r="84" cx="-89" cy="89" /></svg>';
            
    };
    
    Circle('.circle');
    $(".kids-input").on("click", function(){
        let title = "ГДЕ ВАШ РЕБЕНОК ПРОВОДИТ БОЛЬШУЮ ЧАСТЬ СВОЕГО ДНЯ?"
        $("#step-3").find(".lens-builder__question-title").text(title)
        title= "СКОЛЬКО ЧАСОВ В ДЕНЬ ВАШ РЕБЕНОК ПРОВОДИТ ПЕРЕД ЭКРАНОМ КОМПЬЮТЕРА, ТЕЛЕФОНА, ТЕЛЕВИЗОРА И Т.Д.?";
        $("#step-4").find(".lens-builder__question-title").text(title)

        titleKids = "Сталкивался ли ваш ребенок с чем-то из перечисленного?";
        $("#step-5").find(".lens-builder__question-title").text(title)
        title = "УЧАСТВУЕТ ЛИ ВАШ РЕБЕНОК В КАКОЙ-ЛИБО ИЗ СЛЕДУЮЩИХ АКТИВНОСТЕЙ?";
        $("#step-6").find(".lens-builder__question-title").text(title)

    });

    

    let question = 0;
    let questions = $(".question");
    let questionsLength = questions.length;
    let backBtn = $(".back-btn");
    let nextBtn = $(".lens-builder__arrow--next");
    let points = 0;

    $("input").removeAttr("checked");


    function backQuestion(){
        if (question>0){
            question --;
            nextBtn.removeClass("disable")
            refresh ();

            if(question==0)
                backBtn.addClass("disable")

        }
    }
    
    function nextQuestion(toskip){
        question ++;
        backBtn.removeClass("disable")
        if (toskip){
            question += Number(toskip)
        }
        if (questionsLength <= question){
            console.log("result")
            $(".questions").addClass("hidden");
            $(".test__result").removeClass("hidden");
            getResult();
        }
        else{ 
            nextBtn.addClass("disable")
            refresh();
        }

    }

    function refresh(){
        questions.addClass("hidden");
        try {
            questions.eq(question).removeClass("hidden");
            $("#filter-image-wrapper").twentytwenty({
                no_overlay: true
            });
            if (questions.eq(question).find("input:checked").length>0)
                nextBtn.removeClass("disable")
        } 
        catch (TypeError) {  

        }
      
    }

 
    function getResult(){
        let checkeds = $("input:checked");
        let rvals = $(".real-val");
        let vals = [];
        // console.log(checkeds)
        // console.log(rvals)
        checkeds.each(function( index, el ) {
            vals.push({name : el.getAttribute("name"), val : $(el).val(), rName : "-1"});
        });


        rvals.each(function( index, el ) {
            vals.push({name : el.getAttribute("data-name"), val : $(el).text(), rName : "-1"});
        });

        vals.forEach(val => {
            if (val.name == "in-comp"){
                let text = "Часов перед компьютером: " + val.val;
            }
            else if (val.name == "most-day"){
                if (val.val<0.15){
                    console.log("Весь день на улице")
                }
                else if (val.val<0.35){
                    console.log("В основном на улице");
                }
                else if (val.val<0.65){
                    console.log("Часть времени в помещении, часть – на улице");
                }
                else if (val.val<0.85){
                    console.log("В основном в помещении")
                }
                else{
                    console.log("Весь день в помещении")
                }

            }
            else{
                console.log($('[name="'+val.name+'"][value="'+val.val+'"]+label span').html());
            }
            
        });

        console.log(vals)

        combinations.forEach(element => {
            let resNo = true;
            console.log(element)
            if (element.no != []){
                element.no.forEach(theNo => {
                    // console.log(theNo)

                    vals.forEach(value => {
                        // console.log(value)
                        if (JSON.stringify(theNo) == JSON.stringify(value)){
                            resNo = false
                        }
                    });    
                });
            }
            let resYes = true;
            if (element.yes != []){
                element.yes.forEach(theYes => {
                    let tmpRes = false

                    vals.forEach(value => {
                        if (JSON.stringify(theYes) == JSON.stringify(value)){
                            tmpRes = true;
                        }
                    });   
                    if (!tmpRes){
                        resYes = false;
                    }


                });
            }
            let resMore = true;
            if (element.more != []){
                
                element.more.forEach(theMore => {
                    tmpRes = false
                    vals.forEach(value => {
                        if (theMore.name == value.name){
                            if (value.val > theMore.val){
                                tmpRes = true;
                            }
                        }
                    }); 
                    if (!tmpRes){
                        resMore = false;
                    }   
                });
            }
            let resLess = true;
            if (element.less != []){
                
                element.less.forEach(theless => {
                    tmpRes = false
                    vals.forEach(value => {
                        if (theless.name == value.name){
                            if (value.val < theless.val){
                                tmpRes = true;
                            }
                        }
                    }); 
                    if (!tmpRes){
                        resLess = false;
                    }   
                });
            }
            console.log (resNo , resYes , resMore , resLess)

            $()

            if (resNo && resYes && resMore && resLess){
                console.log(element.value)
                $('[data-brand="'+element.value+'"]').removeClass("hidden")
                console.log(brands.get(element.value))
                $(".position-left").html(template(brands.get(element.value).logo, brands.get(element.value).title, brands.get(element.value).icons))
            }
        });

    }

    nextBtn.on('click', function() {
        // if (!$(this).hasClass("disable"))
            nextQuestion();
    })

    backBtn.on('click', function() {
        backQuestion();
    })

    $('.question input:radio').on('change', function () {
        if ($(this).attr("data-to-skip")){
            console.log("has attr")
            nextQuestion($(this).attr("data-to-skip"));

        }
        else
            nextQuestion();
    });

    questions.each(() => {
        let localQuestion = $(this);
        $('input:checkBox').on('change', function () {
            nextBtn.removeClass("disable")
            let checkedcheckboxes = localQuestion.find("input:checkbox:checked");
            if(checkedcheckboxes.length>0){
                nextBtn.removeClass("disable")
            } else{
                nextBtn.addClass("disable")
            }

        });
    })

    refresh();




})