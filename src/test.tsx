import React, { useState, useEffect, createContext, useContext } from 'react';
import { WebSocketChatManager } from './component/WebSocketChatManager';
import { Chatter } from './component/Chat';

const chatManager = new WebSocketChatManager();

const Test = () => {
  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <Chatter chatManager={chatManager} />
    </div>
  );
};

export default Test;
