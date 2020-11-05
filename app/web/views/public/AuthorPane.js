import React from 'react';
import headImg  from 'resources/public/head.jpg';

function AuthorPane() {
  return (
    <div className="author-pane-wrapper">
      <div className="author-pane-image">
        <img alt="error" src={headImg}/>
      </div>
      <div className="author-pane-text">Stay hungry, Stay foolish.</div>
    </div>
  );
}

export default AuthorPane;
