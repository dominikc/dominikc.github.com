$(document).ready(function() {
  LoadTweets();
});

function LoadTweets() {
  var config = ["dominikc_", 7];
  var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=' + config[0] + '&count=' + config[1] + '&callback=?'
  var names = ["second", "minute", "hour", "day", "week"];
  var seconds = [i=1, i*=60, i*=60, i*=24, i*=7];
  $.getJSON(url, function(data) {
    $.each(data, function(index, value) {
      var username = "", date_s = "", x;
      var text = value.text;
      var tweet_date = new Date(value.created_at);
      var now = new Date();
      var diff = Math.round((now.getTime() - tweet_date.getTime())/1000);
      var right = 0;
      for (var sec in seconds) {
        if (sec < diff) right = sec;
      }
      var q = Math.floor(diff / seconds[right]);
      date_s = q + " " + names[right] + ((q==1) ? "":"s") + " ago";
      if (text.substring(0, 2) == "RT" && text.indexOf(':') > -1) {
        username = text.substring(0, text.indexOf(':') + 2);
        text = text.replace(username, '');
        username = username.replace('RT @', '').replace(': ', '');
      }
      text = text.replace(/http:\/\/([A-Za-z\.\/0-9]*)/g, "<a href=\"http://$1\">http://$1</a>");
      text = text.replace(/\@([a-zA-Z0-9_]*)/g, "<a href=\"http://twitter.com/$1\">@$1</a>");
      
      html = '<div class="tweet">';
      html += '<h6>'+date_s+'</h6>';
      html += '<blockquote>';
      html += '<p>'+text+'</p>';
      if (username != "")
        html += '<small><a href="http://twitter.com/'+username+'">@'+username+'</a></small>';
      html += '</blockquote></div>';
      $('.recent_tweets').append(html);
      if (index == config[1] - 1) {
        $('.twitter_header, .recent_tweets').fadeIn();
        setTimeout(function() {
          $('.twitter_button').css('visibility', 'visible').hide().fadeIn();
        }, 500);
      }
    });
    while ($('.recent_tweets').css('height').replace('px','') > 330) {
      $('.recent_tweets .tweet').last().remove();
    }
  });
}
