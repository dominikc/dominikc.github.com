$(document).ready(function() {
  $('#emailBtn').html('dominikc@me.com');
  $('#emailBtn').bind('click', function() {
    window.location = 'mailto:' + $(this).html();
  })
  LoadTweets();
});

function LoadTweets() {
  var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=dominikc_&count=7&callback=?'
  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  var numerals = ["th", "st", "nd", "rd"];
  for (i = 4; i < 10; i++) numerals.push("th");
  $.getJSON(url, function(data) {
    $.each(data, function(index, value) {
      var username = "", date_s = "", x;
      var text = value.text;
      var tweet_date = new Date(value.created_at);
      var now = new Date();
      var diff = Math.round((now.getTime() - tweet_date.getTime())/1000);
      var absolute_date = false;
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
        absolute_date = true;
      }
      date_s += (absolute_date == false) ? " ago" : "";
      if (text.substring(0, 2) == "RT" && text.indexOf(':') > -1) {
        username = text.substring(0, text.indexOf(':') + 2);
        text = text.replace(username, '');
        username = username.replace('RT @', '').replace(': ', '');
      }
      html = '<div class="tweet">';
      html += '<h6>'+date_s+'</h6>';
      html += '<blockquote>';
      html += '<p>'+text+'</p>';
      if (username != "")
        html += '<small><a href="http://twitter.com/'+username+'">@'+username+'</a></small>';
      html += '</blockquote></div>';

      if ($('.recent_tweets').css('height').replace('px','') < 330) {
        $('.recent_tweets').append(html);
      } else {
        $('.twitter_header, .recent_tweets').fadeIn();
        setTimeout(function() {
          $('.twitter_button').css('visibility', 'visible').hide().fadeIn();
        }, 500);
      }
    });
  });
}
