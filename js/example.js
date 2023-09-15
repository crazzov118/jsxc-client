const server_url = "https://xmpp.meetstream.com:5281/http-bind";
const server_domain = "xmpp.meetstream.com";
let jsxc = new JSXC({
   loadConnectionOptions: (username, password) => {
      return Promise.resolve({
         xmpp: {
            url: server_url,
            domain: server_domain,
         }
      });
   },
   connectionCallback: (jid, status) => {
      const CONNECTED = 5;
      const ATTACHED = 8;

      if (status === CONNECTED || status === ATTACHED) {
         $('.logout').show();
         $('.submit').hide();
         localStorage.setItem(localStorage.getItem("userid") + "_is_logged_in", "1");
         localStorage.setItem("status", "0");
      } else {
         $('.logout').hide();
         $('.submit').show();
         localStorage.setItem(localStorage.getItem("userid") + "_is_logged_in", "0");
         localStorage.setItem("status", "10");
      }
   }
});

$(document).ready(function() {
   $('body').addClass("jsxc-roster-hidden");
})
subscribeToInstantLogin();
watchForm();
watchLogoutButton();

function watchForm() {
   let formElement = $('#watch-form');
   let usernameElement = $('#watch-username');
   let passwordElement = $('#watch-password');

   jsxc.watchForm(formElement, usernameElement, passwordElement);
}

function watchLogoutButton() {
   let buttonElements = $('.logout');

   jsxc.watchLogoutClick(buttonElements);
}

function subscribeToInstantLogin() {
   
   url = server_url;
   domain = server_domain;
   // var username = $(this).find('[name="username"]').val();
   // var password = $(this).find('[name="password"]').val();
   const username = localStorage.getItem("userid");
   const password = localStorage.getItem("password");
   if(!username  || !password) window.location.assign("/signin.html");   
   var jid = username + '@' + domain;
   console.log(url, jid, password);
   if(localStorage.getItem(username + "_is_logged_in") == 1) return;
   else jsxc.start(url, jid, password)
   .then(function() {
      //console.log('>>> CONNECTION READY')
      $('body').addClass('jsxc-fullscreen jsxc-two-columns');
      var roomName = "room4";
      jsxc.manualJoin(localStorage.getItem("userid") + "@xmpp.meetstream.com", roomName, localStorage.getItem("userid"));
      localStorage.setItem(username + "_is_logged_in", '1');
   }).catch(function(err) {
      console.log('>>> catch', err);
   })
   $("body").removeClass("jsxc-roster-hidden");
   $('body').addClass('jsxc-fullscreen jsxc-two-columns');
   // $('#instant-login-form').submit(function(ev) {
   //    var url = $('#bosh-url').val();
   //    var domain = $('#xmpp-domain').val();
      
   //    return false;
   // });
}
