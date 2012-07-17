$(document).ready(function() {
  $('#emailBtn').html('dominikc@me.com');
  LoadTweets();
});
$('#contactSubmit').bind('click', function() {
  $('#contactSubmit').button('loading');
  $.post("http://cencek.pl/mailer.php", { name: $('#inputName').val(), email: $('#inputEmail').val(), content: $('#textarea').val() }, function(data) {
    var element = $('#inputEmail').parent().parent();
    (data.invalid_email == true) ? element.addClass('error') : element.removeClass('error');

    element = $('#textarea').parent().parent();
    (data.invalid_content == true) ? element.addClass('error') : element.removeClass('error');

    (data.error == true) ? $('#contactSubmit').addClass('btn-danger') : $('#contactSubmit').removeClass('btn-danger');
    $('#contactSubmit').button('reset');

    if (data.success == true) {
      $('#contactForm').modal('hide');
    }
  }, "json");
});
$('#contactReset').bind('click', function() {
  $('contactForm').find('form').reset();
  $('#contactSubmit').removeClass('btn-danger');
  $('#inputEmail').parent().parent().removeClass('error');
  $('#textarea').parent().parent().removeClass('error');
});

function LoadTweets() {
  var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=dominikc_&count=6&callback=?'
  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  var numerals = ["th", "st", "nd", "rd"];
  for (i = 4; i < 10; i++) numerals.push("th");
  $.getJSON(url, function(data) {
    console.log(data);
    $.each(data, function(index, value) {
      var username = "", date_s = "", x;
      var text = value.text;
      var tweet_date = new Date(value.created_at);
      var now = new Date();
      var diff = Math.round((now.getTime() - tweet_date.getTime())/1000);
      var ago = true;
      if (diff < 60) {
        date_s = diff + " seconds"
      } else if (diff < 3600) {
        date_s = Math.floor(diff / 60);
        date_s += (date_s == 1) ? " minute" : " minutes";
      } else if (diff < 3600*24) {
        date_s = Math.floor(diff / 3600);
        date_s += (date_s == 1) ? " hour" : " hours";
      } else if (diff < 3600*24*7) {
        date_s = Math.floor(diff / (3600*24));
        date_s += (date_s == 1) ? " day" : " days";
      } else if (diff < 3600*24*7*10) {
        date_s = Math.floor(diff / (3600*24*7));
        date_s += (date_s == 1) ? " week" : " weeks";
      } else {
        date_s += months[tweet_date.getMonth()];
        date_s += " " + tweet_date.getDate();
        date_s += numerals[parseInt(date_s.substr(-1))];
        ago = false;
      }
      date_s += (ago == true) ? " ago" : "";
      if (value.text.substring(0, 2) == "RT" && text.indexOf(':') > -1) {
        username = text.substring(0, text.indexOf(':') + 2);
        text = text.replace(username, '');
        username = username.replace('RT @', '').replace(': ', '');
      }
      html = '<div class="tweet">';
      html += '<h6>'+date_s+'</h6>';
      html += '<blockquote>';
      html += '<p>'+text+'</p>';
      if (username != "") {
        html += '<small><a href="http://twitter.com/'+username+'">@'+username+'</a></small>';
      }
      html += '</blockquote>';
      html += '</div>';
      if ($('.recent_tweets').css('height').replace('px','') < 330) {
      $('.recent_tweets').append(html);
      }
    });
  });
}
