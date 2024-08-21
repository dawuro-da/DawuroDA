import Script from "next/script";

function FacebookChat() {
  return (
    <div>
      <div id="fb-root"></div>

      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <Script strategy="lazyOnload">
        {`
              var chatbox = document.getElementById('fb-customer-chat');
              chatbox.setAttribute("app_id", "${process.env.NEXT_PUBLIC_MESSENGER_APP_ID}");
              chatbox.setAttribute("page_id", "${process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID}");
              chatbox.setAttribute("attribution", "biz_inbox");
        
              window.fbAsyncInit = function() {
                FB.init({
                  xfbml            : true,
                  version          : 'v12.0'
                });
              };
        
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
          `}
      </Script>
    </div>
  );
}

export default FacebookChat;
