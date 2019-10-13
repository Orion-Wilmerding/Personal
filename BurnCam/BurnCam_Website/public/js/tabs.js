
$(document).ready(function(){
 var item_num = $('#tabsNav li').length + 1;
 var btn_state = true;
 
 $('#tabsNav li').hover(function(){
   $(this).addClass('hover');
 },function(){
   $(this).removeClass('hover');
 });
   
 $('#tabsNav li').on('click',function(){
   if(btn_state){
     btn_state = !btn_state;
     $('#tabsNav li').removeClass('currentPage');
     $(this).addClass('currentPage');

     var i = $('#tabsNav li').index(this);
     $('article').removeClass('show');
     $('article').addClass('hide');
     $('article').eq(i).addClass('show');
     
     setTimeout(function(){
       btn_state = !btn_state;
     },500);
   }
 });
});