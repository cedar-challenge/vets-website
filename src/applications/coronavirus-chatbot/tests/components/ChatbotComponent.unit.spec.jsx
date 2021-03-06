import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import * as ChatbotModule from '../../index';
import * as GaEvents from '../../gaEvents';
import * as Utils from '../../utils';
import { ChatbotComponent } from '../../components/ChatbotComponent';

describe('ChatbotComponent <ChatbotComponent>', () => {
  let initializeChatbotStub;
  let linkListenerStub;
  let handleButtonsStub;

  beforeEach(() => {
    initializeChatbotStub = sinon.stub(ChatbotModule, 'initializeChatbot');
    linkListenerStub = sinon.stub(GaEvents, 'addLinkClickListener');
    handleButtonsStub = sinon.stub(Utils, 'handleButtonsPostRender');
  });

  afterEach(() => {
    initializeChatbotStub.restore();
    linkListenerStub.restore();
    handleButtonsStub.restore();
  });

  const setupWindowObject = renderWebChatStub => {
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      WebChat: { renderWebChat: renderWebChatStub },
    });
  };

  it('should render webchat', () => {
    const renderWebChatStub = sinon.stub();

    const oldWindow = global.window;
    setupWindowObject(renderWebChatStub);

    const fakeWebchatOptions = Promise.resolve({});
    initializeChatbotStub.returns(fakeWebchatOptions);

    const wrapper = shallow(<ChatbotComponent />);
    expect(wrapper.find('div').length).to.equal(1);
    expect(initializeChatbotStub.calledOnce).to.be.true;

    fakeWebchatOptions.then(() => {
      expect(renderWebChatStub.calledOnce).to.be.true;
    });

    wrapper.unmount();
    global.window = oldWindow;
  });

  it('should render ChatbotLoadError when error is thrown', () => {
    initializeChatbotStub.throws();

    const wrapper = shallow(<ChatbotComponent />);

    expect(wrapper.state('chatbotError')).to.be.true;
    expect(wrapper.find('ChatbotLoadError').length).to.equal(1);

    wrapper.unmount();
  });
});
