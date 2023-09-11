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
         $('body').addClass('jsxc-fullscreen jsxc-two-columns')
         
      } else {
         $('.logout').hide();
         $('.submit').show();
      }
   }
});

$(document).on("load", function() {
   alert("aaa");
})
subscribeToInstantLogin();
watchForm();
watchLogoutButton();

function watchForm() {
   let formElement = $('#watch-form');
   let usernameElement = $('#watch-username');
   let passwordElement = $('#watch-password');

   // jsxc.watchForm(formElement, usernameElement, passwordElement);
}

function watchLogoutButton() {
   let buttonElements = $('.logout');

   jsxc.watchLogoutClick(buttonElements);
}

function subscribeToInstantLogin() {
   $('#instant-login-form').submit(function(ev) {
      var url = $('#bosh-url').val();
      var domain = $('#xmpp-domain').val();
      url = server_url;
      domain = server_domain;
      var username = $(this).find('[name="username"]').val();
      var password = $(this).find('[name="password"]').val();

      var jid = username + '@' + domain;

      jsxc.start(url, jid, password)
         .then(function() {
            //console.log('>>> CONNECTION READY')
            $('body').addClass('jsxc-fullscreen jsxc-two-columns')
         }).catch(function(err) {
            console.log('>>> catch', err)
         })

      return false;
   });
}
