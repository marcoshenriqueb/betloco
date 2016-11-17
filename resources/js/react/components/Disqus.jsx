import React from 'react';

export default class Disqus extends React.Component {
  openDisqus(){
    var identifier = this.props.identifier;
    var url = this.props.url;
    var title = this.props.title
    if (window.DISQUS != undefined) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = url;
          this.page.title = title;
        }
      })
    }else {
      var disqus_config = function () {
          this.page.url = url;
          this.page.identifier = identifier;
          this.page.title = title;
      };
      (function() {
          var d = document, s = d.createElement('script');
          s.src = 'https://guroo.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
      })();
    }
  }

  componentDidMount() {
    this.openDisqus();
  }

  render(){
    return (
      <div id="disqus_thread"></div>
    )
  }

}
