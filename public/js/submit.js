window.onkeydown = function(){
  switch(event.keyCode){
    case 8:
      $('#form-burden').onsubmit = function(){
        $('#flash').text("CANCLED").show().fadeout(1000);
        location.href="/returning";
      }

    case 13:
      document.submitter.submit();
  }
}
