import React, { useState, useEffect, createContext, useContext } from 'react';
import { WebSocketChatManager } from './component/WebSocketChatManager';
import { Chatter, RealChatter } from './component/Chat';
import { sharedChatManager } from './chatManager';

const Test = () => {
  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <RealChatter chatManager={sharedChatManager} />
    </div>
  );
};

export default Test;
